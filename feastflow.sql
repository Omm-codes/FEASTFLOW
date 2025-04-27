-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: shortline.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,'Dosa','description',80.00,'Breakfast','/images/dosa.jpg',1,'2025-04-18 04:44:21','2025-04-18 08:07:56'),(2,'Masala Dosa','A popular South Indian dish consisting of a crispy dosa filled with a spiced potato mixture.',80.00,'Breakfast','/images/masala.jpg',1,'2025-04-18 04:44:21','2025-04-18 04:44:21'),(3,'Idli Sambhar','Soft and fluffy steamed rice cakes served with a tangy lentil-based vegetable stew.',40.00,'Breakfast','/images/idli.jpg',1,'2025-04-18 04:44:21','2025-04-18 04:44:21'),(4,'Chole Puri','A flavorful North Indian dish made with spiced chickpeas served with deep-fried puffy bread.',70.00,'Lunch','/images/chhola.jpg',1,'2025-04-18 04:44:21','2025-04-18 04:44:21'),(5,'Paneer Butter Masala','A rich and creamy North Indian dish made with paneer in a tomato-based gravy.',120.00,'Lunch','/images/paneer.jpg',1,'2025-04-18 04:44:21','2025-04-18 04:44:21'),(12,'Chocolate Cake','Rich, sweet cake made with cocoa or chocolate.',60.00,'dessert','/images/chocolate cake.jpg',1,'2025-04-27 13:16:07','2025-04-27 14:10:05'),(13,'Fries','Deep-fried potato strips, crispy and golden.',40.00,'Snack','/images/fries.jpg',1,'2025-04-27 13:17:05','2025-04-27 14:09:44'),(14,'yeah bitch','ewfwefsd',22.00,'fgsfdg','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Western-Railway-Medha-EMU.jpg/1200px-Western-Railway-Medha-EMU.jpg',1,'2025-04-27 14:21:47','2025-04-27 14:22:09'),(15,'om','',10.00,'Snack','https://avatars.githubusercontent.com/u/176200758?v=4',1,'2025-04-27 15:44:07','2025-04-27 15:44:07');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `migration_name` varchar(255) NOT NULL,
  `executed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'delivery_to_pickup_migration','2025-04-27 16:45:36');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,4,4,1,70.00,'2025-04-25 16:46:50'),(2,5,2,1,80.00,'2025-04-25 16:53:07'),(3,6,5,1,120.00,'2025-04-25 17:14:38'),(4,7,5,1,120.00,'2025-04-25 17:25:59'),(5,8,5,1,120.00,'2025-04-25 17:30:58'),(6,9,4,1,70.00,'2025-04-25 17:35:13'),(7,10,3,1,40.00,'2025-04-25 17:41:05'),(8,11,4,1,70.00,'2025-04-25 17:58:51'),(9,12,5,1,120.00,'2025-04-25 18:15:31'),(10,13,4,1,70.00,'2025-04-25 18:22:38'),(11,14,4,1,70.00,'2025-04-25 18:28:38'),(12,15,5,1,120.00,'2025-04-25 18:39:03'),(13,16,5,1,120.00,'2025-04-25 18:45:25'),(14,17,1,1,80.00,'2025-04-25 18:53:06'),(15,18,3,1,40.00,'2025-04-25 19:03:18'),(16,19,2,1,80.00,'2025-04-25 19:07:26'),(17,20,2,1,80.00,'2025-04-25 19:07:59'),(18,21,1,1,80.00,'2025-04-25 19:13:48'),(19,22,2,1,80.00,'2025-04-25 19:14:15'),(20,23,2,1,80.00,'2025-04-25 19:17:24'),(21,24,2,1,80.00,'2025-04-25 19:30:36'),(22,25,2,1,80.00,'2025-04-25 19:30:51'),(23,26,2,1,80.00,'2025-04-25 19:34:05'),(24,27,2,1,80.00,'2025-04-27 04:01:24'),(25,28,2,1,80.00,'2025-04-27 04:12:52'),(26,29,2,1,80.00,'2025-04-27 05:28:28'),(27,30,1,1,80.00,'2025-04-27 05:35:24'),(28,31,2,1,80.00,'2025-04-27 06:09:14'),(29,32,2,1,80.00,'2025-04-27 06:22:12'),(30,33,1,1,80.00,'2025-04-27 07:14:29'),(31,34,1,1,80.00,'2025-04-27 08:13:31'),(32,35,1,1,80.00,'2025-04-27 08:23:07'),(33,36,1,1,80.00,'2025-04-27 09:19:49'),(34,37,2,1,80.00,'2025-04-27 09:20:09'),(35,38,1,1,80.00,'2025-04-27 09:23:09'),(36,39,1,1,80.00,'2025-04-27 10:15:52'),(37,40,1,1,80.00,'2025-04-27 10:19:07'),(38,41,2,1,80.00,'2025-04-27 10:21:29'),(39,42,1,1,80.00,'2025-04-27 10:34:33'),(40,43,1,1,80.00,'2025-04-27 10:34:37'),(41,44,1,1,80.00,'2025-04-27 10:48:03'),(42,45,2,1,80.00,'2025-04-27 10:49:35'),(43,46,1,1,80.00,'2025-04-27 12:19:24'),(44,47,1,1,80.00,'2025-04-27 12:22:32'),(45,48,1,1,80.00,'2025-04-27 12:25:19'),(46,49,1,1,80.00,'2025-04-27 12:32:09'),(47,50,2,1,80.00,'2025-04-27 12:40:15'),(48,51,2,1,80.00,'2025-04-27 12:46:07'),(49,52,2,1,80.00,'2025-04-27 13:21:45'),(50,53,3,1,40.00,'2025-04-27 13:31:12'),(51,54,2,1,80.00,'2025-04-27 14:42:42'),(52,54,1,1,80.00,'2025-04-27 14:42:42'),(53,55,1,1,80.00,'2025-04-27 15:17:53'),(54,56,3,1,40.00,'2025-04-27 15:18:08'),(55,57,2,1,80.00,'2025-04-27 15:19:22'),(56,58,2,1,80.00,'2025-04-27 15:43:01'),(57,59,3,1,40.00,'2025-04-27 15:49:33'),(58,60,2,1,80.00,'2025-04-27 15:56:07'),(59,61,3,1,40.00,'2025-04-27 16:14:04'),(60,62,2,1,80.00,'2025-04-27 16:25:54'),(61,63,15,1,10.00,'2025-04-27 16:30:38');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','ready','picked_up','completed','cancelled') DEFAULT 'pending',
  `pickup_address` text NOT NULL,
  `pickup_type` enum('restaurant','home') DEFAULT 'home',
  `pickup_time` time DEFAULT NULL,
  `contact_number` varchar(20) NOT NULL,
  `special_instructions` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `customer_name` varchar(100) DEFAULT 'Guest',
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `payment_method` varchar(50) DEFAULT 'cash',
  `payment_status` varchar(20) DEFAULT 'pending',
  `payment_reference` varchar(50) DEFAULT NULL,
  `original_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (4,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 16:46:50','2025-04-25 16:46:50','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(5,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 16:53:06','2025-04-25 16:53:06','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(6,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:14:37','2025-04-25 17:14:37','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(7,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:25:58','2025-04-25 17:25:58','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(8,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:30:57','2025-04-25 17:30:57','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(9,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:35:12','2025-04-25 17:35:12','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(10,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:41:05','2025-04-25 17:41:05','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(11,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:58:50','2025-04-25 17:58:50','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(12,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:15:31','2025-04-25 18:15:31','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(13,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:22:37','2025-04-25 18:22:37','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(14,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:28:38','2025-04-25 18:28:38','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(15,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:39:02','2025-04-25 18:39:02','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(16,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:45:24','2025-04-25 18:45:24','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(17,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:53:06','2025-04-25 18:53:06','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(18,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:03:17','2025-04-25 19:03:17','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(19,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:07:26','2025-04-25 19:07:26','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(20,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:07:58','2025-04-25 19:07:58','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(21,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:13:48','2025-04-25 19:13:48','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(22,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:14:15','2025-04-25 19:14:15','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(23,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-25 19:17:23','2025-04-25 19:17:23','SWAPNIL VIJAY DHIVARE','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(24,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-25 19:30:35','2025-04-25 19:30:35','SWAPNIL VIJAY DHIVARE','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(25,5,80.00,'pending','ss','home',NULL,'09307066176',NULL,'2025-04-25 19:30:50','2025-04-25 19:30:50','SWAPNIL VIJAY DHIVARE','snack ','09307066176','UPI','pending',NULL,NULL),(26,5,80.00,'pending','jj','home',NULL,'999',NULL,'2025-04-25 19:34:04','2025-04-25 19:34:04','SWAPNIL VIJAY DHIVARE','jj','999','UPI','pending',NULL,NULL),(27,4,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 04:01:23','2025-04-27 04:01:23','Admin User','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(28,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 04:12:51','2025-04-27 04:12:51','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(29,5,80.00,'pending','m','home',NULL,'09307066176',NULL,'2025-04-27 05:28:27','2025-04-27 05:28:27','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(30,5,80.00,'pending','ghansoli','home',NULL,'9307066176',NULL,'2025-04-27 05:35:24','2025-04-27 05:35:24','Swapnil Dhivare','sdhivare.12@gmail.com','9307066176','UPI','pending',NULL,NULL),(31,5,80.00,'processing','Ghansoli','home',NULL,'9307066176',NULL,'2025-04-27 06:09:13','2025-04-27 06:12:46','Swapnil Dhivare','sdhivare.12@gmail.com','9307066176','UPI','pending','PAY-31-365035',NULL),(32,4,80.00,'processing','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 06:22:11','2025-04-27 06:22:17','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending','PAY-32-935932',NULL),(33,5,80.00,'processing','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 07:14:28','2025-04-27 07:14:33','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending','PAY-33-071655',NULL),(34,5,80.00,'processing','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 08:13:31','2025-04-27 08:22:50','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending','PAY-34-168325',NULL),(35,4,80.00,'processing','hello','home',NULL,'9307066176',NULL,'2025-04-27 08:23:07','2025-04-27 08:23:13','Swapnil Dhivare','sdhivare.12@gmail.com','9307066176','UPI','pending','PAY-35-191932',NULL),(36,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 09:19:49','2025-04-27 09:19:49','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(37,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 09:20:08','2025-04-27 09:20:08','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(38,5,80.00,'completed','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 09:23:08','2025-04-27 09:48:22','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending','PAY-38-791616',NULL),(39,4,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 10:15:51','2025-04-27 10:15:51','Admin User','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(40,4,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 10:19:06','2025-04-27 10:19:06','Admin User','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(41,4,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 10:21:29','2025-04-27 10:21:29','Admin User','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(42,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 10:34:32','2025-04-27 10:34:32','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(43,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 10:34:37','2025-04-27 10:34:37','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(44,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 10:48:02','2025-04-27 10:48:02','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(45,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 10:49:34','2025-04-27 10:49:34','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(46,5,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:19:24','2025-04-27 12:19:24','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(47,5,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:22:31','2025-04-27 12:22:31','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(48,5,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:25:18','2025-04-27 12:25:18','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(49,5,80.00,'processing','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:32:08','2025-04-27 12:32:18','Guest','guest@example.com','Not provided','cash','pending','PAY-49-135319','paid'),(50,5,80.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:40:14','2025-04-27 16:19:41','Guest','guest@example.com','Not provided','cash','pending','PAY-50-617211','delivered'),(51,4,80.00,'processing','ewqrwgsgfg','home',NULL,'244342334',NULL,'2025-04-27 12:46:07','2025-04-27 12:46:18','Admin User','admin@feastflow.com','244342334','UPI','pending','PAY-51-977420',NULL),(52,5,80.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 13:21:44','2025-04-27 14:31:37','Guest','guest@example.com','Not provided','cash','pending',NULL,'delivered'),(53,9,40.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 13:31:12','2025-04-27 14:20:28','Guest','guest@example.com','Not provided','cash','pending',NULL,'delivered'),(54,4,160.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 14:42:41','2025-04-27 14:42:41','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(55,11,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:17:53','2025-04-27 15:17:53','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(56,11,40.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:18:07','2025-04-27 15:18:07','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(57,5,80.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:19:22','2025-04-27 15:20:00','Guest','guest@example.com','Not provided','cash','pending',NULL,'ready'),(58,5,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:43:00','2025-04-27 15:43:00','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(59,4,40.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:49:33','2025-04-27 15:49:33','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(60,4,80.00,'cancelled','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:56:07','2025-04-27 16:20:04','Guest','guest@example.com','Not provided','online','pending','PAY-60-368938','cancelled'),(61,5,40.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 16:14:03','2025-04-27 16:19:02','Guest','guest@example.com','Not provided','online','pending','PAY-61-446569','delivered'),(62,5,80.00,'processing','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 16:25:54','2025-04-27 16:25:57','Guest','guest@example.com','Not provided','online','pending','PAY-62-155925','paid'),(63,5,10.00,'processing','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 16:30:37','2025-04-27 16:30:41','Guest','guest@example.com','Not provided','online','pending','PAY-63-439977','paid');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_backup`
--

DROP TABLE IF EXISTS `orders_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_backup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `pickup_address` text NOT NULL,
  `pickup_type` enum('restaurant','home') DEFAULT 'home',
  `pickup_time` time DEFAULT NULL,
  `contact_number` varchar(20) NOT NULL,
  `special_instructions` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `customer_name` varchar(100) DEFAULT 'Guest',
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `payment_method` varchar(50) DEFAULT 'cash',
  `payment_status` varchar(20) DEFAULT 'pending',
  `payment_reference` varchar(50) DEFAULT NULL,
  `original_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_backup`
--

LOCK TABLES `orders_backup` WRITE;
/*!40000 ALTER TABLE `orders_backup` DISABLE KEYS */;
INSERT INTO `orders_backup` VALUES (4,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 16:46:50','2025-04-25 16:46:50','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(5,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 16:53:06','2025-04-25 16:53:06','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(6,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:14:37','2025-04-25 17:14:37','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(7,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:25:58','2025-04-25 17:25:58','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(8,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:30:57','2025-04-25 17:30:57','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(9,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:35:12','2025-04-25 17:35:12','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(10,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:41:05','2025-04-25 17:41:05','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(11,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 17:58:50','2025-04-25 17:58:50','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(12,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:15:31','2025-04-25 18:15:31','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(13,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:22:37','2025-04-25 18:22:37','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(14,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:28:38','2025-04-25 18:28:38','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(15,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:39:02','2025-04-25 18:39:02','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(16,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:45:24','2025-04-25 18:45:24','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(17,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 18:53:06','2025-04-25 18:53:06','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(18,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:03:17','2025-04-25 19:03:17','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(19,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:07:26','2025-04-25 19:07:26','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(20,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:07:58','2025-04-25 19:07:58','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(21,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:13:48','2025-04-25 19:13:48','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(22,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-25 19:14:15','2025-04-25 19:14:15','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(23,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-25 19:17:23','2025-04-25 19:17:23','SWAPNIL VIJAY DHIVARE','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(24,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-25 19:30:35','2025-04-25 19:30:35','SWAPNIL VIJAY DHIVARE','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(25,5,80.00,'pending','ss','home',NULL,'09307066176',NULL,'2025-04-25 19:30:50','2025-04-25 19:30:50','SWAPNIL VIJAY DHIVARE','snack ','09307066176','UPI','pending',NULL,NULL),(26,5,80.00,'pending','jj','home',NULL,'999',NULL,'2025-04-25 19:34:04','2025-04-25 19:34:04','SWAPNIL VIJAY DHIVARE','jj','999','UPI','pending',NULL,NULL),(27,4,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 04:01:23','2025-04-27 04:01:23','Admin User','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(28,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 04:12:51','2025-04-27 04:12:51','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(29,5,80.00,'pending','m','home',NULL,'09307066176',NULL,'2025-04-27 05:28:27','2025-04-27 05:28:27','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(30,5,80.00,'pending','ghansoli','home',NULL,'9307066176',NULL,'2025-04-27 05:35:24','2025-04-27 05:35:24','Swapnil Dhivare','sdhivare.12@gmail.com','9307066176','UPI','pending',NULL,NULL),(31,5,80.00,'processing','Ghansoli','home',NULL,'9307066176',NULL,'2025-04-27 06:09:13','2025-04-27 06:12:46','Swapnil Dhivare','sdhivare.12@gmail.com','9307066176','UPI','pending','PAY-31-365035',NULL),(32,4,80.00,'processing','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 06:22:11','2025-04-27 06:22:17','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending','PAY-32-935932',NULL),(33,5,80.00,'processing','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 07:14:28','2025-04-27 07:14:33','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending','PAY-33-071655',NULL),(34,5,80.00,'processing','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 08:13:31','2025-04-27 08:22:50','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending','PAY-34-168325',NULL),(35,4,80.00,'processing','hello','home',NULL,'9307066176',NULL,'2025-04-27 08:23:07','2025-04-27 08:23:13','Swapnil Dhivare','sdhivare.12@gmail.com','9307066176','UPI','pending','PAY-35-191932',NULL),(36,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 09:19:49','2025-04-27 09:19:49','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(37,5,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 09:20:08','2025-04-27 09:20:08','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending',NULL,NULL),(38,5,80.00,'completed','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 09:23:08','2025-04-27 09:48:22','Swapnil Dhivare','sdhivare.12@gmail.com','09307066176','UPI','pending','PAY-38-791616',NULL),(39,4,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 10:15:51','2025-04-27 10:15:51','Admin User','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(40,4,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 10:19:06','2025-04-27 10:19:06','Admin User','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(41,4,80.00,'pending','Room No. 4, 2nd floor, Aashirwad palace, Near century high school, Murbad road,Ulhasnagar-1','home',NULL,'09307066176',NULL,'2025-04-27 10:21:29','2025-04-27 10:21:29','Admin User','admin@feastflow.com','09307066176','UPI','pending',NULL,NULL),(42,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 10:34:32','2025-04-27 10:34:32','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(43,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 10:34:37','2025-04-27 10:34:37','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(44,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 10:48:02','2025-04-27 10:48:02','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(45,5,0.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 10:49:34','2025-04-27 10:49:34','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(46,5,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:19:24','2025-04-27 12:19:24','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(47,5,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:22:31','2025-04-27 12:22:31','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(48,5,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:25:18','2025-04-27 12:25:18','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(49,5,80.00,'processing','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:32:08','2025-04-27 12:32:18','Guest','guest@example.com','Not provided','cash','pending','PAY-49-135319','paid'),(50,5,80.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 12:40:14','2025-04-27 16:19:41','Guest','guest@example.com','Not provided','cash','pending','PAY-50-617211','delivered'),(51,4,80.00,'processing','ewqrwgsgfg','home',NULL,'244342334',NULL,'2025-04-27 12:46:07','2025-04-27 12:46:18','Admin User','admin@feastflow.com','244342334','UPI','pending','PAY-51-977420',NULL),(52,5,80.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 13:21:44','2025-04-27 14:31:37','Guest','guest@example.com','Not provided','cash','pending',NULL,'delivered'),(53,9,40.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 13:31:12','2025-04-27 14:20:28','Guest','guest@example.com','Not provided','cash','pending',NULL,'delivered'),(54,4,160.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 14:42:41','2025-04-27 14:42:41','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(55,11,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:17:53','2025-04-27 15:17:53','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(56,11,40.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:18:07','2025-04-27 15:18:07','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(57,5,80.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:19:22','2025-04-27 15:20:00','Guest','guest@example.com','Not provided','cash','pending',NULL,'ready'),(58,5,80.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:43:00','2025-04-27 15:43:00','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(59,4,40.00,'pending','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:49:33','2025-04-27 15:49:33','Guest','guest@example.com','Not provided','cash','pending',NULL,NULL),(60,4,80.00,'cancelled','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 15:56:07','2025-04-27 16:20:04','Guest','guest@example.com','Not provided','online','pending','PAY-60-368938','cancelled'),(61,5,40.00,'completed','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 16:14:03','2025-04-27 16:19:02','Guest','guest@example.com','Not provided','online','pending','PAY-61-446569','delivered'),(62,5,80.00,'processing','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 16:25:54','2025-04-27 16:25:57','Guest','guest@example.com','Not provided','online','pending','PAY-62-155925','paid'),(63,5,10.00,'processing','Not provided','home',NULL,'Not provided',NULL,'2025-04-27 16:30:37','2025-04-27 16:30:41','Guest','guest@example.com','Not provided','online','pending','PAY-63-439977','paid');
/*!40000 ALTER TABLE `orders_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'pickup_fee','40','Fee charged for home pickup service','2025-04-27 16:45:35','2025-04-27 16:45:35'),(2,'restaurant_address','FeastFlow Restaurant, Main Street, City','Address of the restaurant for pickup instructions','2025-04-27 16:45:35','2025-04-27 16:45:35'),(3,'restaurant_pickup_hours','10:00-22:00','Hours available for restaurant pickup','2025-04-27 16:45:35','2025-04-27 16:45:35');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `default_pickup_address` text,
  `default_pickup_type` enum('restaurant','home') DEFAULT 'restaurant',
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','newtest@example.com','$2a$10$OonHy6uCbcfFCKnHmcXISei7BS0GYR2vQTYAdoerO34qzgxBJUR/m',NULL,NULL,'restaurant','user','2025-04-18 04:49:41','2025-04-18 04:49:41'),(4,'Admin User','admin@feastflow.com','$2a$10$XLEsTy4Gs/0Ql8Wv5kBtXuEXDWn9RuOGLCi948eOfR6xyZ7mTlOQS',NULL,NULL,'restaurant','admin','2025-04-18 05:17:17','2025-04-18 05:17:17'),(5,'Swapnil Dhivare','sdhivare.12@gmail.com','$2a$10$X8N3dSSOesLE/sSEaMHFn.cL1CX9Rx.LSBbfiJPkvAcSDwMDsOSFq',NULL,NULL,'restaurant','user','2025-04-18 05:37:28','2025-04-18 05:37:28'),(6,'Sunny','dhivares12@gmail.com','$2a$10$DxwTZe2SExe9sbbnU/CaeOO91b2U0aia9ld3s4Dicx1yV4Y/5SIZ6',NULL,NULL,'restaurant','user','2025-04-18 06:07:18','2025-04-18 06:07:18'),(9,'SwapXD','sunnydhivare12@gmail.com','$2a$10$zRBlNlqe3nI8EghvgHk7j.QUcSXqLITwV2HW/VI/3/DM96c7BDM6u',NULL,NULL,'restaurant','user','2025-04-27 13:30:39','2025-04-27 13:30:39'),(10,'prince','omprince83@gmail.com','$2a$10$CcLq0pR387Vk/dUhF3V6dOwhrppaOjb/735ZeskZlIS/EPwd6k8dS',NULL,NULL,'restaurant','user','2025-04-27 14:44:07','2025-04-27 14:44:07'),(11,'OM ','om@gmail.com','$2a$10$cdb5l4Dy94s1gM/k9HAtAe9ssrVJJ3LyR9aijQtTla.wLYwE/XvsW',NULL,NULL,'restaurant','user','2025-04-27 15:16:57','2025-04-27 15:16:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'railway'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-27 22:24:47
