import pandas as pd
import xgboost as xgb

# Load the dataset
data = pd.read_csv('creditcard.csv')

# Extract features and labels
X = data.drop('Class', axis=1)
y = data['Class']

# Load the trained model
model = xgb.XGBClassifier()
model.load_model('xgb_model.json')

# Predict using the model
predictions = model.predict(X)

# Find fraudulent transactions
fraud_indices = [i for i, pred in enumerate(predictions) if pred == 1]

# Extract the first fraudulent transaction's features
if fraud_indices:
    first_fraudulent_transaction = X.iloc[fraud_indices[0]]
    print(first_fraudulent_transaction)
else:
    print("No fraudulent transactions predicted.")
