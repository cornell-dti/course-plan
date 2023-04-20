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


class NCFModel:
    def __init__(self, n_users, n_items, model_path, EPOCHS, BATCH_SIZE, SEED) -> None:
        model = NCF(
            n_users=n_users,
            n_items=n_items,
            model_type="NeuMF",
            n_factors=4,
            layer_sizes=[16, 8, 4],
            n_epochs=EPOCHS,
            batch_size=BATCH_SIZE,
            learning_rate=1e-3,
            verbose=10,
            seed=SEED)
        model.load(neumf_dir=model_path)
        self.model = model

    def predict_all(self, user_id, course_list):
        return self.model.predict(user_id, course_list, is_list=True)

    def predict(self, user_id, course_id) -> int:
        return self.model.predict(user_id, course_id, is_list=False)
