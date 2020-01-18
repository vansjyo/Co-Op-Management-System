# Co-Op-Management-System
An E-commerce web app for ordering and selling products built using node.js and MongoDB database.

# Incorporated features
## Admin Interface
* Login, access to all data using the interface
* Access to monitor activity of staff, add a staff member, delete a staff member
* Add items to database, delete items, edit the detais of the current items
* Monitor the sales and cost(purchase) incurred, track of defective items, hence estimate of the total profit.
* Monitor the current or orders in progress
## Staff Interface
* Login using credentials emailed to the staff member when admin adds a staff member to the database
* Access to items and orders database, access to edit the item details, where there activity is logged to the database accessible to the admin.
* Can monitor orders placed and change the status as the order is "cancelled","dispatched" or "delivered", which is visible to the user on his inteface as well.
## User Interface
* Login, Signup with email and mobile OTP confirmation.
* Explore, Add items to card, Place the order.
* database is checked for the item details and availability at two steps tlll the final order is confirmed.
* User can monitor the status of his order and cancel the order.
* The purchase history and current ordres is displayed. 

## Specifications
- **Back-End**: Node.js, MongoDB
- **Front-End**: HTML, CSS, EJS and JavaScript/JQuery

## Installation and Set Up
- Fork/Clone the repository locally
- Install nodejs and NPM from [here](https://nodejs.org/en/download/package-manager/)
- Install and setup Mongodb from [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- Run the following commands
```bash
cd /path-to-folder/Co-Op-Management-System
npm install
npm install mongoose --save (if npm install does not successfully install it)
npm iinstall bcrypt --save (if bcrypt found broken)
npm install -g node-gyp --save
npm start (make sure mongodb is up and running)
```

## Contributing
- The repository is open to contribution from all interested developers. Kindly send us Pull Requests or open/solve an issue with explanation as to what changes you have done.
- A detailed explanantion of how we came to building this software is maintained at the [Wiki](https://github.com/vansjyo/Co-Op-Management-System/wiki) page.
- This repository is created and currently maintained by @[vansjyo](https://github.com/salman-bhai).

## Team members:
* Vanshika Gupta (Developer) @[vansjyo](https://github.com/vansjyo)
* Salman Shah (Mentor) @[salman-bhai](https://github.com/salman-bhai)
* Hrishikesh Hiraskar (Mentor) @[hrily](https://github.com/hrily)

## License
- The software is registered under the MIT License.

## Attached UI design
![Home](https://github.com/vansjyo/Co-Op-Management-System/blob/master/Screenshots/home.png)
1 of 6
![Index](https://raw.github.com/vansjyo/Co-Op-Management-System/master/Screenshots/index.png)
2 of 6
![Login](https://raw.github.com/vansjyo/Co-Op-Management-System/master/Screenshots/login.png)
3 of 6
![Signup](https://raw.github.com/vansjyo/Co-Op-Management-System/master/Screenshots/signup.png)
4 of 6
![Categories](https://raw.github.com/vansjyo/Co-Op-Management-System/master/Screenshots/categories.png)
5 of 6
![Cart](https://raw.github.com/vansjyo/Co-Op-Management-System/master/Screenshots/cart.png)
6 of 6

