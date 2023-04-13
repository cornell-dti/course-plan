import pandas
from recommenders.datasets import movielens
from recommenders.datasets.python_splitters import python_chrono_split
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--use_sample_data",
                    help="Use the Movielens Dataset", action="store_true")
args = parser.parse_args()

if args.use_sample_data:
    df = movielens.load_pandas_df(
        size='100k',
        header=["userID", "itemID", "rating", "timestamp"]
    )
else:
    df = pandas.read_csv("ratings.csv")

df.head()

train, test = python_chrono_split(df, 0.75)

test = test[test["userID"].isin(train["userID"].unique())]
test = test[test["itemID"].isin(train["itemID"].unique())]

leave_one_out_test = test.groupby("userID").last().reset_index()

train_file = "./train.csv"
test_file = "./test.csv"
leave_one_out_test_file = "./leave_one_out_test.csv"
train.to_csv(train_file, index=False)
test.to_csv(test_file, index=False)
leave_one_out_test.to_csv(leave_one_out_test_file, index=False)
