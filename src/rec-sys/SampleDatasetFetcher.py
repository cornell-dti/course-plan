from recommenders.datasets import movielens
from recommenders.datasets.python_splitters import python_chrono_split

MOVIELENS_DATA_SIZE = '100k'

df = movielens.load_pandas_df(
    size=MOVIELENS_DATA_SIZE,
    header=["userID", "itemID", "rating", "timestamp"]
)

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
