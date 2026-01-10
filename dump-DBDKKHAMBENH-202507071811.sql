-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: DBDKKHAMBENH
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Allcodes`
--

DROP TABLE IF EXISTS `Allcodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Allcodes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `keyMap` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `valueEn` varchar(255) DEFAULT NULL,
  `valueVi` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyMap` (`keyMap`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Allcodes`
--

LOCK TABLES `Allcodes` WRITE;
/*!40000 ALTER TABLE `Allcodes` DISABLE KEYS */;
INSERT INTO `Allcodes` VALUES (1,'R1','ROLE','Patient','Bệnh nhân','2025-02-26 01:25:12','2025-02-26 01:25:12'),(2,'R2','ROLE','Doctor','Bác sĩ','2025-02-26 01:25:12','2025-02-26 01:25:12'),(3,'R3','ROLE','Admin','Quản trị viên','2025-02-26 01:25:12','2025-02-26 01:25:12'),(4,'P1','POSITION','Specialist','Chuyên gia','2025-02-26 01:25:12','2025-02-26 01:25:12'),(5,'P2','POSITION','Head of Department','Trưởng khoa','2025-02-26 01:25:12','2025-02-26 01:25:12'),(6,'P3','POSITION','Professor','Giáo sư','2025-02-26 01:25:12','2025-02-26 01:25:12'),(7,'T1','TIME','8:00 - 9:00','8:00 - 9:00','2025-02-26 01:25:12','2025-02-26 01:25:12'),(8,'T2','TIME','9:00 - 10:00','9:00 - 10:00','2025-02-26 01:25:12','2025-02-26 01:25:12'),(9,'T3','TIME','10:00 - 11:00','10:00 - 11:00','2025-02-26 01:25:12','2025-02-26 01:25:12'),(10,'T4','TIME','11:00 - 12:00','11:00 - 12:00','2025-02-26 01:25:12','2025-02-26 01:25:12'),(11,'T5','TIME','13:00 - 14:00','13:00 - 14:00','2025-02-26 01:25:12','2025-02-26 01:25:12'),(12,'T6','TIME','14:00 - 15:00','14:00 - 15:00','2025-02-26 01:25:12','2025-02-26 01:25:12'),(13,'S1','STATUS','Pending','Chờ xác nhận','2025-02-26 01:25:12','2025-02-26 01:25:12'),(14,'S2','STATUS','Confirmed','Đã xác nhận','2025-02-26 01:25:12','2025-02-26 01:25:12'),(15,'S3','STATUS','Cancelled','Đã hủy','2025-02-26 01:25:12','2025-02-26 01:25:12');
/*!40000 ALTER TABLE `Allcodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bookings`
--

DROP TABLE IF EXISTS `Bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `statusId` varchar(255) DEFAULT NULL,
  `doctorId` int DEFAULT NULL,
  `patientId` int DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `timeType` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `statusId` (`statusId`),
  KEY `doctorId` (`doctorId`),
  KEY `patientId` (`patientId`),
  KEY `timeType` (`timeType`),
  CONSTRAINT `Bookings_ibfk_1` FOREIGN KEY (`statusId`) REFERENCES `Allcodes` (`keyMap`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bookings_ibfk_2` FOREIGN KEY (`doctorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bookings_ibfk_3` FOREIGN KEY (`patientId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bookings_ibfk_4` FOREIGN KEY (`timeType`) REFERENCES `Allcodes` (`keyMap`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bookings`
--

LOCK TABLES `Bookings` WRITE;
/*!40000 ALTER TABLE `Bookings` DISABLE KEYS */;
INSERT INTO `Bookings` VALUES (2,'S1',6,4,'2025-04-17 12:02:46','T4','77e84dbf-d029-4eea-9634-722a8472c867','2025-02-26 01:25:12','2025-02-26 01:25:12'),(4,'S1',6,2,'2025-08-24 06:50:37','T1','c1b1926c-a0d5-4b45-959d-4b1dad8e2026','2025-02-26 01:25:12','2025-02-26 01:25:12'),(5,'S2',6,5,'2025-03-21 12:02:10','T3','daf549c3-a68f-4fa0-9022-0d68c8403822','2025-02-26 01:25:12','2025-04-30 07:13:11'),(6,'S3',6,5,'2026-02-15 14:02:29','T1','5939e3c3-34f7-4b2b-a1f7-ba5a66f15e19','2025-02-27 08:07:14','2025-02-27 08:08:48'),(7,'S1',6,5,'2026-02-15 14:02:29','T1','e1cea39d-7465-4154-83e3-8837adf6bfe2','2025-02-27 08:08:13','2025-02-27 08:08:13'),(8,'S1',6,8,'2025-04-16 00:00:00','T3','88084de2-3b1c-46c0-b1cd-04406da6f2a8','2025-04-16 02:47:54','2025-04-16 02:47:54'),(9,'S1',6,8,'2025-04-16 00:00:00','T3','8ad91406-c2e4-4d1c-ae05-443da142daee','2025-04-16 06:19:27','2025-04-16 06:19:27'),(10,'S1',6,8,'2025-04-16 00:00:00','T3','38fc03f7-db37-4892-8517-f7fe9ea9db23','2025-04-16 06:25:42','2025-04-16 06:25:42'),(11,'S1',6,4,'2025-04-16 00:00:00','T3','c8e1772d-f8a8-4392-aa1a-b9d722657fea','2025-04-16 06:39:46','2025-04-16 06:39:46'),(12,'S1',6,4,'2025-04-16 00:00:00','T6','ef545fcb-38ff-4313-a2b3-d1fe370a8c60','2025-04-16 07:09:47','2025-04-16 07:09:47'),(13,'S1',6,4,'2025-04-16 00:00:00','T6','db2de3a3-87c5-46b3-a610-7c57d4dd5c5e','2025-04-16 07:12:20','2025-04-16 07:12:20'),(17,'S3',17,28,'2025-06-05 00:00:00','T1','a78c80ea-bb5a-4a0b-a52a-d2002b016e0e','2025-06-05 07:23:56','2025-06-05 07:24:07'),(18,'S2',17,28,'2025-06-05 00:00:00','T1','c91698d6-69ba-41d4-ae06-9d497b37667b','2025-06-05 07:30:32','2025-06-05 07:38:44'),(19,'S2',17,28,'2025-06-05 00:00:00','T1','9f35888d-d050-42ab-8ce4-378ff17a51e3','2025-06-05 07:44:01','2025-06-05 07:44:57');
/*!40000 ALTER TABLE `Bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DoctorDetails`
--

DROP TABLE IF EXISTS `DoctorDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DoctorDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctorId` int NOT NULL,
  `descriptionMarkdown` text,
  `descriptionHTML` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doctorId` (`doctorId`),
  CONSTRAINT `DoctorDetails_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DoctorDetails`
--

LOCK TABLES `DoctorDetails` WRITE;
/*!40000 ALTER TABLE `DoctorDetails` DISABLE KEYS */;
INSERT INTO `DoctorDetails` VALUES (1,6,'Colligo solitudo ter tabella. Utpote fugit vilis asporto. Tredecim creber auxilium stipes cibo atque antepono doloremque.\nAnte in accendo ustulo culpo. Capillus clarus desparatus ante caste defetiscor beatae error. Ultio pectus volup delicate sum vae utrimque autus atrocitas.','Peior acer spero acidus. Tepesco subito sustineo aliquam volutabrum cruentus cornu. Nemo a tibi asper assentator confido curso.\nAudio adsum admoveo vero. Varius calculus corroboro caries. Iure praesentium crinis vorago natus deleniti demulceo usque.','2025-02-26 01:25:12','2025-02-26 01:25:12'),(2,38,'Bác sĩ chuyên khoa Nội tổng quát với hơn 10 năm kinh nghiệm','<p>Bác sĩ chuyên khoa Nội tổng quát với hơn 10 năm kinh nghiệm</p>','2025-05-19 07:43:35','2025-05-19 07:43:35'),(6,42,'fdagga&nbsp;','fdagga&nbsp;','2025-06-05 06:47:23','2025-06-05 06:47:23');
/*!40000 ALTER TABLE `DoctorDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Schedules`
--

DROP TABLE IF EXISTS `Schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctorId` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `timeType` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `maxNumber` int NOT NULL DEFAULT '1',
  `currentNumber` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `doctorId` (`doctorId`),
  KEY `timeType` (`timeType`),
  CONSTRAINT `Schedules_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Schedules_ibfk_2` FOREIGN KEY (`timeType`) REFERENCES `Allcodes` (`keyMap`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `check_current_number_not_exceed_max` CHECK ((`currentNumber` <= `maxNumber`)),
  CONSTRAINT `check_current_number_not_negative` CHECK ((`currentNumber` >= 0)),
  CONSTRAINT `check_max_number_positive` CHECK ((`maxNumber` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedules`
--

LOCK TABLES `Schedules` WRITE;
/*!40000 ALTER TABLE `Schedules` DISABLE KEYS */;
INSERT INTO `Schedules` VALUES (1,6,'2025-02-26','T1','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(2,6,'2025-02-26','T2','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(3,6,'2025-02-26','T3','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(4,6,'2025-02-26','T4','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(5,6,'2025-02-26','T5','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(6,6,'2025-02-26','T6','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(7,6,'2025-02-27','T1','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(8,6,'2025-02-27','T2','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(9,6,'2025-02-27','T3','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(10,6,'2025-02-27','T4','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(11,6,'2025-02-27','T5','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(12,6,'2025-02-27','T6','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(13,6,'2025-02-28','T1','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(14,6,'2025-02-28','T2','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(15,6,'2025-04-08','T3','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(16,6,'2025-04-08','T4','2025-02-26 01:25:12','2025-02-26 01:25:12',1,0),(17,6,'2025-04-30','T5','2025-04-30 01:25:12','2025-02-26 01:25:12',1,0),(18,6,'2025-04-30','T6','2025-04-30 01:25:12','2025-02-26 01:25:12',1,0),(19,6,'2025-04-30','T3','2025-04-30 07:21:44','2025-03-10 07:21:44',1,0),(20,6,'2025-04-30','T3','2025-05-01 07:22:02','2025-03-10 07:22:02',1,0),(25,8,'2025-05-08','T2','2025-05-07 07:37:56','2025-05-07 07:37:56',20,0),(26,13,'2025-05-21','T3','2025-05-20 01:47:06','2025-05-20 01:47:06',20,0),(27,15,'2025-05-21','T1','2025-05-20 02:14:00','2025-05-20 02:14:00',20,0),(28,17,'2025-05-21','T1','2025-05-20 02:14:53','2025-05-20 02:14:53',3,0),(29,4,'2025-06-05','T1','2025-06-05 07:03:01','2025-06-05 08:33:36',13,0),(30,17,'2025-06-05','T1','2025-06-05 07:03:25','2025-06-05 07:44:57',3,1),(32,14,'2025-06-06','T2','2025-06-05 08:30:58','2025-06-05 08:30:58',4,0),(33,16,'2025-06-06','T2','2025-06-05 08:31:25','2025-06-05 08:31:25',1,0);
/*!40000 ALTER TABLE `Schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('1migration_Allcode.js'),('2migration_Specialty.js'),('3migration_User.js'),('4migration_Booking.js'),('5migration_Schedule.js'),('6migration_DoctorDetail.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Specialties`
--

DROP TABLE IF EXISTS `Specialties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Specialties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Specialties`
--

LOCK TABLES `Specialties` WRITE;
/*!40000 ALTER TABLE `Specialties` DISABLE KEYS */;
INSERT INTO `Specialties` VALUES (5,'Cơ xương khớp','image/co-xuong-khop.png','chuyên chẩn đoán và điều trị các bệnh lý liên quan đến hệ cơ, xương và khớp, bao gồm thoái hóa khớp, viêm khớp, loãng xương, thoát vị đĩa đệm, gãy xương, chấn thương thể thao,... Bác sĩ chuyên khoa sử dụng các phương pháp như vật lý trị liệu, thuốc, phẫu thuật hoặc tiêm khớp để giúp bệnh nhân giảm đau và cải thiện chức năng vận động.','2025-03-05 07:17:39','2025-03-05 07:17:39'),(6,'Da liễu','image/da-lieu.png','chuyên chẩn đoán và điều trị các bệnh liên quan đến da, tóc, móng và các bệnh lây qua đường tình dục. Một số bệnh lý phổ biến gồm mụn trứng cá, viêm da, nấm da, vảy nến, chàm, rụng tóc, nám, tàn nhang và các bệnh nhiễm trùng da. Ngoài ra, chuyên khoa còn cung cấp dịch vụ thẩm mỹ da như trẻ hóa da, điều trị sẹo, xóa nám và tẩy nốt ruồi.','2025-03-05 07:20:45','2025-03-05 07:20:45'),(7,'Cột sống','image/cot-song.png','Chuyên chẩn đoán, điều trị và phục hồi các bệnh lý liên quan đến cột sống như thoát vị đĩa đệm, thoái hóa cột sống, gai cột sống, cong vẹo cột sống, đau thần kinh tọa và chấn thương cột sống. Bác sĩ chuyên khoa sẽ áp dụng các phương pháp điều trị từ bảo tồn (vật lý trị liệu, thuốc, tiêm giảm đau) đến phẫu thuật khi cần thiết để giúp bệnh nhân phục hồi chức năng vận động và giảm đau hiệu quả.','2025-03-05 07:21:48','2025-03-05 07:21:48'),(8,'Hô hấp - Phổi','image/ho-hap-phoi.png','Chuyên chẩn đoán và điều trị các bệnh liên quan đến đường hô hấp và phổi như viêm phổi, hen suyễn, bệnh phổi tắc nghẽn mạn tính (COPD), lao phổi, viêm phế quản, ung thư phổi và các bệnh lý khác. Bác sĩ sẽ áp dụng các phương pháp điều trị như dùng thuốc, liệu pháp oxy, vật lý trị liệu hô hấp hoặc can thiệp ngoại khoa khi cần thiết để giúp bệnh nhân cải thiện chức năng hô hấp và nâng cao chất lượng cuộc sống.','2025-03-05 07:23:15','2025-03-05 07:23:15'),(9,'Mắt','image/mat.png','Chuyên chẩn đoán, điều trị và chăm sóc các bệnh lý về mắt như cận thị, viễn thị, loạn thị, đục thủy tinh thể, glôcôm, viêm kết mạc, thoái hóa điểm vàng và các bệnh lý võng mạc. Bác sĩ chuyên khoa mắt sẽ thực hiện kiểm tra thị lực, đo khúc xạ, phẫu thuật mắt (nếu cần) và tư vấn phương pháp điều trị phù hợp để bảo vệ và cải thiện sức khỏe đôi mắt.','2025-03-05 07:24:16','2025-03-05 07:24:49'),(10,'Nha khoa','image/nha-khoa.png','Chuyên chẩn đoán, điều trị và chăm sóc các vấn đề về răng miệng như sâu răng, viêm nướu, viêm nha chu, răng khôn, mất răng và các bệnh lý về hàm mặt. Các dịch vụ phổ biến bao gồm khám răng định kỳ, trám răng, nhổ răng, niềng răng, bọc răng sứ, cấy ghép implant và tẩy trắng răng, giúp duy trì sức khỏe răng miệng và cải thiện thẩm mỹ nụ cười.','2025-03-05 07:26:31','2025-03-05 07:26:31'),(11,'Sản phụ khoa','image/san-phu-khoa.png','Chuyên chăm sóc sức khỏe sinh sản của phụ nữ, bao gồm theo dõi thai kỳ, khám và điều trị các bệnh lý phụ khoa, hỗ trợ sinh sản, tư vấn kế hoạch hóa gia đình và quản lý các vấn đề tiền mãn kinh. Ngoài ra, chuyên khoa này còn thực hiện các thủ thuật như siêu âm thai, xét nghiệm sàng lọc dị tật, điều trị rối loạn nội tiết và phẫu thuật sản khoa khi cần thiết.','2025-03-05 07:27:42','2025-03-05 07:27:42'),(14,'Tiêu Hóa','image/tieu-hoa.png','Chuyên chẩn đoán và điều trị các bệnh liên quan đến hệ tiêu hóa, bao gồm thực quản, dạ dày, ruột non, đại tràng, gan, tụy và túi mật. Các bệnh lý thường gặp trong chuyên khoa này gồm viêm loét dạ dày – tá tràng, trào ngược dạ dày thực quản, hội chứng ruột kích thích, viêm gan, xơ gan, sỏi mật, viêm tụy và ung thư đường tiêu hóa. Bác sĩ tiêu hóa thường sử dụng các phương pháp như nội soi tiêu hóa, siêu âm, xét nghiệm máu và chẩn đoán hình ảnh để phát hiện và điều trị bệnh.','2025-03-05 07:33:09','2025-03-05 07:33:09');
/*!40000 ALTER TABLE `Specialties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `roleId` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `positionId` varchar(255) DEFAULT NULL,
  `specialtyId` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `roleId` (`roleId`),
  KEY `positionId` (`positionId`),
  KEY `specialtyId` (`specialtyId`),
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `Allcodes` (`keyMap`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Users_ibfk_2` FOREIGN KEY (`positionId`) REFERENCES `Allcodes` (`keyMap`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Users_ibfk_3` FOREIGN KEY (`specialtyId`) REFERENCES `Specialties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (2,'Kobe','Collier','Joelle75@hotmail.com','$2b$10$8XXI.D06d9igHPj6.v3JEuzzhoaP3X07CE7iPAR.5gETiIKndafFC','81053 Belmont Road',0,'R3','1-765-330-5430','P1',NULL,'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/81.jpg','2025-02-26 01:25:12','2025-02-26 01:25:12'),(4,'Lexus','Hahn','Rocky2@gmail.com','$2b$10$8XXI.D06d9igHPj6.v3JEuzzhoaP3X07CE7iPAR.5gETiIKndafFC','4060 Wehner Square',1,'R2','0987654321','P1',8,'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/9.jpg','2025-02-26 01:25:12','2025-06-05 08:21:49'),(5,'Judy','Runolfsson','Marlee.Tillman53@hotmail.com','$2b$10$8XXI.D06d9igHPj6.v3JEuzzhoaP3X07CE7iPAR.5gETiIKndafFC','2827 S Lincoln Street',1,'R2','666-829-4834 x9481','P1',11,'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/87.jpg','2025-02-26 01:25:12','2025-06-05 08:21:55'),(6,'Amiya','Langworth','Vince35@yahoo.com','$2b$10$8XXI.D06d9igHPj6.v3JEuzzhoaP3X07CE7iPAR.5gETiIKndafFC','1147 Dina Streets',1,'R2','(291) 842-4297 x82979','P2',NULL,'','2025-02-26 01:25:12','2025-03-10 06:29:08'),(7,'Buddy','Frami','Prince22@yahoo.com','$2b$10$8XXI.D06d9igHPj6.v3JEuzzhoaP3X07CE7iPAR.5gETiIKndafFC','178 Stamm Canyon',1,'R2','965.540.2020 x607','P3',NULL,'https://avatars.githubusercontent.com/u/15250277','2025-02-26 01:25:12','2025-02-26 01:25:12'),(8,'John123','Doe','test@example.com','$2b$10$2zrhXGPIUZ69JiEGxSr2B.dns7XPR4kRwyvZ1e58fhKyxZtASs0RG','123 Main Street, City',1,'R2','0987654321','P1',NULL,NULL,'2025-03-04 00:18:55','2025-03-26 06:13:28'),(10,'Le','abc','doctor@example.com','$2b$10$XgWqEYJdRvIYJXp8.CyJ3O7Yovx5z7IlYGordkfo5JLwzYvkD0OSy','456 Đường XYZ, Quận 2',1,'R2','0987654321','P1',5,'https://example.com/image.jpg','2025-04-28 06:29:14','2025-04-28 06:29:14'),(11,'Admin','User','admin@example.com','$2b$10$P.OVk9deppQm8fBLKolTeecsjlI7wZjhlwKtnvhhU0Rb8XGDos0Uy','123 Admin Street',1,'R2','0123456789','P1',5,NULL,'2025-05-10 08:18:23','2025-05-10 08:18:23'),(12,'Nguyễn Lan','Anh','doctor1@example.com','$2b$10$3YdMl0cFmvDvZdU5dVGpTONC/BLaIgczQsaFRG5ISnpa2./NMbSoK','456 Doctor Street',0,'R2','0987654321','P2',5,NULL,'2025-05-10 08:21:29','2025-05-10 08:21:29'),(13,'Nguyễn Văn','Nam','doctor2@example.com','$2b$10$hoi1Do1QcR8gajHZJc1r8.Gtsl.OYUJowj6vCTAcH.17LiiadZpAS','456 Doctor Street',0,'R2','0987654321','P2',6,'/uploads/avatars/1749454779083-117526409.jpg','2025-05-10 08:22:27','2025-06-09 07:39:39'),(14,'Nguyễn Duy','Mạnh','doctor3@example.com','$2b$10$L4ecUJ9Ww1UXYiFEBbCDp..GgrKWIUB71tUB8Ry/r4H7ihO/5lo1e','456 Doctor Street',1,'R2','0987654321','P3',6,NULL,'2025-05-10 08:24:03','2025-05-10 08:24:03'),(15,'Nguyễn Anh','Duy','doctor4@example.com','$2b$10$V0teouPAgNuOylSeDZrLieRd3vQY0nQH9/G74PB/N8Z.2UhNycY9u','456 Doctor Street',1,'R2','0987654321','P1',7,NULL,'2025-05-10 08:31:46','2025-05-10 08:31:46'),(16,'Nguyễn Ánh','Tuyết','doctor5@example.com','$2b$10$.i7l1wyjZP7k2Hz/oPXDnOkAILm2IwsnPVpcurWx8hScwVpW0Xbdu','456 Doctor Street',0,'R2','0987654321','P2',7,NULL,'2025-05-10 08:32:23','2025-05-10 08:32:23'),(17,'Trần Kim','Duyên','doctor6@example.com','$2b$10$FTMU4D94XrBsY28clIDUnOJR.hogWKCgiK.G/RSWyx5BmNC.ynNti','456 Doctor Street',0,'R2','0987654321','P1',8,NULL,'2025-05-10 08:32:43','2025-05-10 08:32:43'),(18,'Trần Trọng','Kim','doctor7@example.com','$2b$10$N..2wLnYg.gYYzHpn5a.SekXg.GZ540mEbLdtoho7APHabN.Dg/De','456 Doctor Street',0,'R2','0987654321','P3',8,NULL,'2025-05-10 08:33:06','2025-05-10 08:33:06'),(19,'Ngô Thanh','Huy','doctor9@example.com','$2b$10$rp6kbEn8iAuxc20kj9bqzeR9r5MbVzdVzXSD7z/0brp8WS9QdE4HW','456 Doctor Street',1,'R2','0987654321','P2',9,NULL,'2025-05-10 08:33:34','2025-05-10 08:33:34'),(20,'Phan','Thiết','doctor10@example.com','$2b$10$/vESEMoaFCoFr6QYqIfg/.v1Us/G0K96Wgzz6J9/Kw5peYeO1mGCK','456 Doctor Street',1,'R2','0987654321','P3',9,NULL,'2025-05-10 08:34:23','2025-05-10 08:34:23'),(21,'Phạm Ngũ','Lão','doctor11@example.com','$2b$10$qmtXoYxcsg5v7CCOrI1Q3.HrKlTlqH0EBBz1nO2LSX1Dm59BWxmK6','456 Doctor Street',1,'R2','0987654321','P1',10,NULL,'2025-05-10 08:34:52','2025-05-10 08:34:52'),(22,'Trần Quang','Khải','doctor12@example.com','$2b$10$b4SsC0VEP3xeslZDwBM9nORRfRwRJsB3owvb.FWH2AMXbn1wm8tP2','456 Doctor Street',1,'R2','0987654321','P2',10,NULL,'2025-05-10 08:35:43','2025-05-10 08:35:43'),(23,'Lê Khả','Ái','doctor13@example.com','$2b$10$ZTFQx7XzDuJIRVjfEzzjxuUDjyLU5IcI0C9.ZjO2Zvt7KFgqvIH5S','456 Doctor Street',1,'R2','0987654321','P3',11,NULL,'2025-05-10 08:36:23','2025-05-10 08:36:23'),(24,'Mai Quốc','Khánh','doctor14@example.com','$2b$10$ntPSKGcQW3aa6J5QhQ8XEeQgb33A3BRW8xPCfebAIoRkR1i9ZmBB.','456 Doctor Street',1,'R2','0987654321','P1',11,NULL,'2025-05-10 08:38:36','2025-05-10 08:38:36'),(25,'Phùng Ngọc','Huy','doctor15@example.com','$2b$10$Ej2XPo3wXytdnSli74a9L.zlO6EczV14S/6KjR4mothAgicgu2qX6','456 Doctor Street',1,'R2','0987654321','P3',14,NULL,'2025-05-10 08:39:05','2025-05-10 08:39:05'),(26,'Đoàn Anh','Thư','doctor16@example.com','$2b$10$gQj6/znCPeavCxPh5CDDfeG3nB/I5eVAqldt9Zxnoeo9FqDXZvoyG','456 Doctor Street',0,'R2','0987654321','P2',14,NULL,'2025-05-10 08:39:49','2025-05-10 08:39:49'),(27,'Đoàn Anh','Thư','doctor17@example.com','$2b$10$tSfw2BYSdN34BTEoSaUKsOy3QTwzdJWmPEMqBqzUwO5/cEImfsaOO','456 Doctor Street',0,'R2','0987654321','P2',6,'','2025-05-14 00:38:43','2025-05-14 00:38:43'),(28,'Trần Quang','Huy','patient@example.com','$2b$10$n2DnEvpxhQm6VE68KAiY9u/nBOzQteHqnmPdD7XdKBaMPtINNOAeK','456 Doctor Street',0,'R1','0987654321',NULL,NULL,'/uploads/avatars/1749115676914-750610314.jpg','2025-05-14 00:40:10','2025-06-05 09:27:56'),(30,'Trần Anh','Tuấn','admin2@example.com','$2b$10$gQPsGMY/YtTz.aIEBUvFZuA3Zdb3lf8iVzTSDwtsjIT3GuzRGkBva','456 Doctor Street',1,'R3','0987654321',NULL,NULL,'/uploads/avatars/1749115270568-558822949.png','2025-05-14 00:48:13','2025-06-05 09:21:10'),(31,'test','test','admin123@example.com','$2b$10$vebO/EG.WH.LO2.6Q8d8cumiG7f9R0/vi7kOhNmdGxBbGWTbSTs1W','123',1,'R3','12345678','P1',NULL,NULL,'2025-05-14 01:11:20','2025-05-14 01:11:20'),(33,'test','test','test123@example.com','$2b$10$Yk62t2g7J1IzanZTZKMRgeekk6pSA74IoWVj0FXqk4hCVrELGKSIi','123',1,'R3','123','P1',NULL,NULL,'2025-05-14 01:57:23','2025-05-14 01:57:23'),(34,'test','test','test1234@example.com','$2b$10$7.e/hdpuIVaz066f..Vb9u9U2sj2C/EZtvYdhW01DA1sT2iHPac5W','123',1,'R3','123',NULL,NULL,NULL,'2025-05-14 02:00:23','2025-05-14 02:00:23'),(38,'Nguyễn','Văn A','doctor.test@example.com','$2b$10$4O6hhMo9hAOOQ9cS99ZkFefAHwTDNYqz.3LCLEALge7wxZYqvuCKe','123 Đường ABC, Quận XYZ, TP.HCM',1,'R2','0987654321','P1',14,'https://example.com/doctor-avatar.jpg','2025-05-19 07:43:35','2025-05-19 07:43:35'),(42,'Nguyen','test','test123456@gmail.com','$2b$10$4X/LMbSa1da6ikn0x.NMzeTtlIzERXc45mFPZ57lqWFe3Glc6CyO6','',1,'R2','','P1',5,'/uploads/99074967-df0c-4da9-a15d-776fc88033d7-DALL·E 2024-11-05 15.16.27 - A sleek, modern logo for the brand \'Stardust\' with a dark color theme. The design should be minimalistic, featuring a stylized star or cosmic dust sym-fotor-20241105153229.png','2025-06-05 06:47:23','2025-06-05 06:47:23');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'DBDKKHAMBENH'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-07 18:11:15
