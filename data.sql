CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT NOT NULL
);

INSERT INTO sales (name, image) VALUES
('Heski', 'assets/images/pfp/pfp1.jpg'),
('Zaki', 'assets/images/pfp/pfp2.jpg'),
('Syadul', 'assets/images/pfp/pfp3.jpg'),
('Fatur', 'assets/images/pfp/pfp4.jpg'),
('Jibran', 'assets/images/pfp/pfp5.jpg');


CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salesId INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (salesid) REFERENCES sales(id)
);

INSERT INTO customers (salesId, name) VALUES
(1, 'Harry Potter'),
(1, 'Hermione Granger'),
(1, 'Ron Weasley'),
(1, 'Draco Malfoy'),
(1, 'Luna Lovegood'),

(2, 'Jon Snow'),
(2, 'Daenerys Targaryen'),
(2, 'Arya Stark'),
(2, 'Tyrion Lannister'),
(2, 'Cersei Lannister'),

(3, 'Rick Grimes'),
(3, 'Daryl Dixon'),
(3, 'Michonne'),
(3, 'Negan'),
(3, 'Glenn Rhee'),

(4, 'Thomas'),
(4, 'Newt'),
(4, 'Minho'),
(4, 'Teresa Agnes'),
(4, 'Gally'),

(5, 'Archie Andrews'),
(5, 'Veronica Lodge'),
(5, 'Betty Cooper'),
(5, 'Jughead Jones'),
(5, 'Cheryl Blossom');

CREATE TABLE purchased_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER NOT NULL,
    itemName TEXT NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    weight REAL NOT NULL,
    goldPurity INTEGER NOT NULL,
    sellingPrice INTEGER NOT NULL,
    productImage TEXT NOT NULL,
    FOREIGN KEY (customerId) REFERENCES customers(id)
);

INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (1, 'Cartier Drop Earrings', 'earrings', 
    '2025-07-05', 3.7, 90, 17400000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (1, 'Van Cleef & Arpels Stud Earrings', 'earrings', 
    '2025-06-30', 8.2, 80, 62600000000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (2, 'Cartier Charm Bracelet', 'bracelet', 
    '2025-07-17', 7.2, 99, 13940000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (3, 'Bvlgari Cuff Bracelet', 'bracelet', 
    '2025-06-04', 17.1, 75, 18860000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (3, 'Tiffany & Co. Stud Earrings', 'earrings', 
    '2025-07-13', 19.8, 90, 7330000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (3, 'Swarovski Hoop Earrings', 'earrings', 
    '2025-08-07', 5.8, 85, 52400000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (4, 'Pandora Choker Necklace', 'necklace', 
    '2025-06-03', 10.8, 80, 15040000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (4, 'Tiffany & Co. Choker Necklace', 'necklace', 
    '2025-07-25', 4.4, 99, 14610000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (4, 'Rolex Love Bracelet', 'bracelet', 
    '2025-07-30', 14.8, 75, 1262000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (5, 'Bvlgari Eternity Ring', 'ring', 
    '2025-08-03', 16.6, 99, 1394000000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (5, 'Chopard Drop Earrings', 'earrings', 
    '2025-07-05', 6.5, 90, 10590000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (6, 'Cartier Drop Earrings', 'earrings', 
    '2025-07-24', 16.8, 90, 15550000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (6, 'Harry Winston Love Bracelet', 'bracelet', 
    '2025-06-21', 3.1, 80, 6110000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (6, 'Graff Cuff Bracelet', 'bracelet', 
    '2025-07-13', 1.4, 80, 15200000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (7, 'Swarovski Love Bracelet', 'bracelet', 
    '2025-07-11', 10.3, 99, 12340000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (7, 'Bvlgari Drop Earrings', 'earrings', 
    '2025-06-21', 18.5, 99, 18520000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (8, 'Graff Halo Ring', 'ring', 
    '2025-07-23', 16.1, 99, 18470000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (9, 'Swarovski Drop Earrings', 'earrings', 
    '2025-06-14', 18.7, 99, 8610000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (9, 'Tiffany & Co. Halo Ring', 'ring', 
    '2025-06-05', 15.5, 75, 18230000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (10, 'Chopard Drop Earrings', 'earrings', 
    '2025-07-09', 6.2, 75, 16580000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (10, 'Chopard Cuff Bracelet', 'bracelet', 
    '2025-07-20', 17.9, 85, 18100000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (10, 'Van Cleef & Arpels Chain Necklace', 'necklace', 
    '2025-07-29', 11.4, 90, 10210000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (11, 'Cartier Choker Necklace', 'necklace', 
    '2025-06-01', 7.4, 80, 10760000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (11, 'Rolex Solitaire Ring', 'ring', 
    '2025-06-05', 3.8, 85, 19110000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (11, 'Bvlgari Solitaire Ring', 'ring', 
    '2025-07-15', 9.0, 90, 5710000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (12, 'Cartier Cuff Bracelet', 'bracelet', 
    '2025-07-22', 16.2, 75, 18540000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (13, 'Cartier Love Bracelet', 'bracelet', 
    '2025-06-30', 13.1, 85, 10200000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (13, 'Pandora Charm Bracelet', 'bracelet', 
    '2025-06-18', 14.4, 99, 3120000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (14, 'Bvlgari Eternity Ring', 'ring', 
    '2025-06-04', 4.7, 95, 19100000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (14, 'Tiffany & Co. Cuff Bracelet', 'bracelet', 
    '2025-06-26', 5.2, 95, 12310000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (15, 'Pandora Cuff Bracelet', 'bracelet', 
    '2025-06-12', 9.9, 75, 3540000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (15, 'Chopard Pendant Necklace', 'necklace', 
    '2025-08-01', 13.9, 95, 9350000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (16, 'Tiffany & Co. Drop Earrings', 'earrings', 
    '2025-06-07', 13.0, 90, 4740000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (17, 'Harry Winston Cuff Bracelet', 'bracelet', 
    '2025-07-05', 6.8, 75, 6670000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (17, 'Rolex Cuff Bracelet', 'bracelet', 
    '2025-07-06', 3.1, 95, 11590000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (17, 'Pandora Hoop Earrings', 'earrings', 
    '2025-06-02', 19.1, 80, 16930000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (18, 'Pandora Stud Earrings', 'earrings', 
    '2025-08-04', 16.2, 75, 4360000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (18, 'Harry Winston Chain Necklace', 'necklace', 
    '2025-08-06', 15.5, 90, 5530000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (18, 'Graff Chain Necklace', 'necklace', 
    '2025-07-21', 11.6, 85, 3200000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (19, 'Chopard Eternity Ring', 'ring', 
    '2025-07-18', 15.9, 95, 10760000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (20, 'Rolex Cuff Bracelet', 'bracelet', 
    '2025-07-27', 6.3, 95, 17150000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (20, 'Harry Winston Love Bracelet', 'bracelet', 
    '2025-07-12', 11.2, 75, 19190000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (20, 'Pandora Drop Earrings', 'earrings', 
    '2025-07-17', 11.6, 75, 17800000, 
    'assets/images/jewellery/earrings.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (21, 'Tiffany & Co. Cuff Bracelet', 'bracelet', 
    '2025-07-31', 2.1, 85, 10780000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (22, 'Tiffany & Co. Charm Bracelet', 'bracelet', 
    '2025-06-03', 16.3, 85, 9860000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (22, 'Pandora Halo Ring', 'ring', 
    '2025-06-28', 4.7, 95, 11630000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (22, 'Swarovski Chain Necklace', 'necklace', 
    '2025-07-02', 19.0, 85, 13170000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (23, 'Harry Winston Solitaire Ring', 'ring', 
    '2025-07-25', 15.0, 80, 17010000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (24, 'Graff Choker Necklace', 'necklace', 
    '2025-07-04', 3.9, 85, 5390000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (24, 'Van Cleef & Arpels Eternity Ring', 'ring', 
    '2025-07-08', 19.0, 75, 3390000, 
    'assets/images/jewellery/ring.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (24, 'Tiffany & Co. Cuff Bracelet', 'bracelet', 
    '2025-06-11', 8.6, 90, 10990000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (25, 'Harry Winston Choker Necklace', 'necklace', 
    '2025-06-22', 16.6, 99, 17170000, 
    'assets/images/jewellery/necklace.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (25, 'Chopard Charm Bracelet', 'bracelet', 
    '2025-08-08', 4.4, 75, 17910000, 
    'assets/images/jewellery/bracelet.jpg');
INSERT INTO purchased_items 
    (customerId, itemName, type, date, weight, goldPurity, sellingPrice, productImage) 
    VALUES (25, 'Cartier Choker Necklace', 'necklace', 
    '2025-07-01', 15.9, 80, 4700000, 
    'assets/images/jewellery/necklace.jpg');