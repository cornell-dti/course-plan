from recommenders.evaluation.python_evaluation import (rmse, mae, rsquared, exp_var, map_at_k, ndcg_at_k, precision_at_k,
                                                       recall_at_k, get_top_k_items)
from recommenders.utils.constants import SEED as DEFAULT_SEED
from recommenders.models.ncf.dataset import Dataset as NCFDataset
from recommenders.models.ncf.ncf_singlenode import NCF
from recommenders.utils.timer import Timer
import sys
import os
import shutil
import papermill as pm
import scrapbook as sb
import pandas as pd
import numpy as np
import tensorflow as tf
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--save_model",
                    help="Save the model locally", action="store_true")
parser.add_argument('--use_whole_dataset',
                    help='Train on the entire dataset for prod, skips testing', action="store_true")
args = parser.parse_args()

tf.get_logger().setLevel('ERROR')  # only show error messages
print("System version: {}".format(sys.version))
print("Pandas version: {}".format(pd.__version__))
print("Tensorflow version: {}".format(tf.__version__))

# top k items to recommend
TOP_K = 10

# Model parameters
EPOCHS = 100
BATCH_SIZE = 128

SEED = DEFAULT_SEED  # Set None for non-deterministic results
if args.use_whole_dataset:
    data = NCFDataset(train_file='./ratings.csv', test_file='./leave_one_out_test.csv',
                      seed=SEED, overwrite_test_file_full=True)
    train = pd.read_csv('./ratings.csv')
else:
    data = NCFDataset(train_file='./train.csv', test_file='./leave_one_out_test.csv',
                      seed=SEED, overwrite_test_file_full=True)
    train = pd.read_csv("./train.csv")
test = pd.read_csv("./test.csv")

model = NCF(
    n_users=data.n_users,
    n_items=data.n_items,
    model_type="NeuMF",
    n_factors=4,
    layer_sizes=[16, 8, 4],
    n_epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    learning_rate=1e-3,
    verbose=10,
    seed=SEED
)

with Timer() as train_time:
    model.fit(data)

print("Took {} seconds for training.".format(train_time.interval))
if args.save_model:
    model.save("model")
if not args.use_whole_dataset:
    predictions = [[row.userID, row.itemID, model.predict(row.userID, row.itemID)]
                   for (_, row) in test.iterrows()]

    predictions = pd.DataFrame(predictions, columns=[
        'userID', 'itemID', 'prediction'])
    predictions.head()

    with Timer() as test_time:
        users, items, preds = [], [], []
        item = list(train.itemID.unique())
        for user in train.userID.unique():
            user = [user] * len(item)
            users.extend(user)
            items.extend(item)
            preds.extend(list(model.predict(user, item, is_list=True)))

        all_predictions = pd.DataFrame(
            data={"userID": users, "itemID": items, "prediction": preds})

        merged = pd.merge(train, all_predictions, on=[
            "userID", "itemID"], how="outer")
        all_predictions = merged[merged.rating.isnull()].drop('rating', axis=1)

    print("Took {} seconds for prediction.".format(test_time.interval))

    eval_map = map_at_k(test, all_predictions,
                        col_prediction='prediction', k=TOP_K)
    eval_ndcg = ndcg_at_k(test, all_predictions,
                          col_prediction='prediction', k=TOP_K)
    eval_precision = precision_at_k(
        test, all_predictions, col_prediction='prediction', k=TOP_K)
    eval_recall = recall_at_k(test, all_predictions,
                              col_prediction='prediction', k=TOP_K)

    print("MAP:\t%f" % eval_map,
          "NDCG:\t%f" % eval_ndcg,
          "Precision@K:\t%f" % eval_precision,
          "Recall@K:\t%f" % eval_recall, sep='\n')

    assert (eval_map < 0.1)
    assert (eval_ndcg < 0.25)
    assert (eval_precision < 0.2)
    assert (eval_recall < 0.25)
