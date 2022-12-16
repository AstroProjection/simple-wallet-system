# Simple Wallet System
A backend service for Wallet system supporting

Setup Instructions:
1. You will need to have mongodb compass ( https://www.mongodb.com/docs/compass/current/install/ ) for your system or you can use the mongodb atlas free cluster that is provided at https://www.mongodb.com/ when you sign up.
2. Follow the instructions and copy the mongodb URI of the cluster and paste it within the '.env.development' file under the MONGO_URI key
3. Rename the '.env.development' to '.env'
4. open up a terminal window:
 a. navigate to the root of the project and run 'npm install'
 b. navigate to the 'client' folder and run 'npm install'

Run:
1. From the root of the project, run 'npm run dev' to load up a local instance of the project


API Modifications:
1. fetch transactions api (/transactions?limit=&skip=&sort=) :
parameter 'sort' which contains a string of the form Key_SortDirection (i.e Date_ASC,Amount_DESC) To further extend the sorting capabilities, 
the keys must be added to the sortKeys object on the backend.

Added this as a way to limit the sorting abilities to only 'date' and 'amount'. 
