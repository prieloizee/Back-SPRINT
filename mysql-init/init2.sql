-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: projeto_senai
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `datahora_inicio` datetime NOT NULL,
  `datahora_fim` datetime NOT NULL,
  `fk_id_usuario` int NOT NULL,
  `fk_id_sala` int NOT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `fk_id_usuario` (`fk_id_usuario`),
  KEY `fk_id_sala` (`fk_id_sala`),
  CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`fk_id_sala`) REFERENCES `sala` (`id_sala`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (2,'2025-03-27 11:00:00','2025-03-27 12:00:00',1,57),(3,'2025-03-28 11:00:00','2025-03-28 12:00:00',1,55);
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_feita`
--

DROP TABLE IF EXISTS `reserva_feita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_feita` (
  `id_reserva_feita` int NOT NULL AUTO_INCREMENT,
  `fk_id_reserva` int DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  PRIMARY KEY (`id_reserva_feita`),
  KEY `fk_id_reserva` (`fk_id_reserva`),
  CONSTRAINT `reserva_feita_ibfk_1` FOREIGN KEY (`fk_id_reserva`) REFERENCES `reserva` (`id_reserva`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_feita`
--

LOCK TABLES `reserva_feita` WRITE;
/*!40000 ALTER TABLE `reserva_feita` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva_feita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `id_sala` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(50) NOT NULL,
  `descricao` varchar(100) NOT NULL,
  `capacidade` int NOT NULL,
  PRIMARY KEY (`id_sala`),
  UNIQUE KEY `numero` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
INSERT INTO `sala` VALUES (46,'A1','CONVERSORES',16),(47,'A2','ELETRÔNICA',16),(48,'A3','CLP',16),(49,'A4','AUTOMAÇÃO',20),(50,'A5','METROLOGIA',16),(51,'A6','PNEUMÁTICA/HIDRÁULICA',20),(52,'COEL','OFICINA DE COMANDOS ELÉTRICOS',16),(53,'ITEL1','OFICINA DE INSTALAÇÕES ELÉTRICAS - G1',16),(54,'ITEL2','OFICINA DE INSTALAÇÕES ELÉTRICAS - G2',16),(55,'TOR','OFICINA DE TORNEARIA',20),(56,'AJFR','OFICINA DE AJUSTAGEM/FRESAGEM',16),(57,'CNC','OFICINA DE CNC',16),(58,'MMC','OFICINA DE MANUTENÇÃO MECÂNICA',16),(59,'SOLD','OFICINA DE SOLDAGEM',16),(60,'B2','SALA DE AULA',32),(61,'B3','SALA DE AULA',32),(62,'B5','SALA DE AULA',40),(63,'B6','SALA DE AULA',32),(64,'B7','SALA DE AULA',32),(65,'B8','LAB. INFORMÁTICA',20),(66,'B9','LAB. INFORMÁTICA',16),(67,'B10','LAB. INFORMÁTICA',16),(68,'B11','LAB. INFORMÁTICA',40),(69,'B12','LAB. INFORMÁTICA',40),(70,'ALI','LAB. ALIMENTOS',16),(71,'C1','SALA DE AULA',24),(72,'C2','LAB. DE INFORMÁTICA',32),(73,'C3','SALA DE MODELAGEM VESTUÁRIO',20),(74,'C4','SALA DE MODELAGEM VESTUÁRIO',20),(75,'C5','SALA DE AULA',16),(76,'VEST','OFICINA DE VESTUÁRIO',20),(77,'MPESP','OFICINA DE MANUTENÇÃO PESPONTO',16),(78,'AUTO','OFICINA DE MANUTENÇÃO AUTOMOTIVA',20),(79,'D1','SALA MODELAGEM',16),(80,'D2','SALA DE MODELAGEM',20),(81,'D3','SALA DE AULA',16),(82,'D4','SALA DE CRIAÇÃO',18),(83,'CORT1','OFICINA DE CORTE - G1',16),(84,'CORT2','OFICINA DE CORTE - G2',16),(85,'PRE','OFICINA DE PREPARAÇÃO',16),(86,'PESP1','OFICINA DE PESPONTO - G1',16),(87,'PESP2','OFICINA DE PESPONTO - G2',16),(88,'PESP3','OFICINA DE PESPONTO - G3',16),(89,'MONT1','OFICINA DE MONTAGEM - G1',16),(90,'MONT2','OFICINA DE MONTAGEM - G2',16);
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `cpf` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Gabriel','gabriel@teste.com','12321233567','senha123'),(2,'Livia','livia@teste.com','12321264567','senha123'),(3,'Malu','malu@teste.com','12321232567','senha123'),(4,'Priscila','priscila@teste.com','12121234567','senha123'),(5,'Ana Clara','ana@teste.com','12321239567','senha123'),(6,'Maria','maria@teste.com','12343456667','senha123'),(7,'Maria','maria1@teste.com','12343456677','senha123');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'projeto_senai'
--

--
-- Dumping routines for database 'projeto_senai'
--
/*!50003 DROP FUNCTION IF EXISTS `total_reservas_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`priscila`@`%` FUNCTION `total_reservas_usuario`(id_usuario int) RETURNS int
    READS SQL DATA
begin
    declare total int;

    select count(*) into total
    from reserva
    where id_usuario = reserva.fk_id_usuario;

    return total;
    end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `verificar_disponibilidade_sala` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`priscila`@`%` FUNCTION `verificar_disponibilidade_sala`(
    p_id_sala INT,
    p_datahora_inicio DATETIME,
    p_datahora_fim DATETIME
) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
    DECLARE v_count INT;

    -- Verificar se a sala está ocupada no período solicitado
    SELECT COUNT(*) INTO v_count
    FROM reserva
    WHERE fk_id_sala = p_id_sala
    AND ((datahora_inicio BETWEEN p_datahora_inicio AND p_datahora_fim)
    OR (datahora_fim BETWEEN p_datahora_inicio AND p_datahora_fim)
    OR (p_datahora_inicio BETWEEN datahora_inicio AND datahora_fim)
    OR (p_datahora_fim BETWEEN datahora_inicio AND datahora_fim));

    RETURN v_count = 0;  -- Retorna TRUE se a sala estiver disponível, caso contrário, FALSE
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cancelar_reserva` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`priscila`@`%` PROCEDURE `cancelar_reserva`(
    IN p_id_reserva INT
)
BEGIN
    DELETE FROM reserva WHERE id_reserva = p_id_reserva;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `registrar_reserva` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`priscila`@`%` PROCEDURE `registrar_reserva`(
    in p_id_usuario int,
    in p_id_sala int,
    in p_datahora_inicio datetime,
    in p_datahora_fim datetime
)
begin
    declare v_id_reserva int; -- declaração da variavel


    insert into reserva (datahora_inicio, datahora_fim, fk_id_usuario, fk_id_sala)
    values (p_datahora_inicio, p_datahora_fim, p_id_usuario, p_id_sala);

    set v_id_reserva = last_insert_id();

end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-28 16:08:08
