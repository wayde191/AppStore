-- phpMyAdmin SQL Dump
-- version 3.5.5
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2013 at 09:41 PM
-- Server version: 5.5.14
-- PHP Version: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ihakula`
--

-- --------------------------------------------------------

--
-- Table structure for table `ih_scrum_task`
--

DROP TABLE IF EXISTS `ih_scrum_task`;
CREATE TABLE IF NOT EXISTS `ih_scrum_task` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `type` int(11) NOT NULL,
  `begin_date` date NOT NULL,
  `end_date` date NOT NULL,
  `done_date` date NOT NULL,
  `project_id` int(11) NOT NULL,
  `principal` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `schedule` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `reserved` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `ih_scrum_task`
--

INSERT INTO `ih_scrum_task` (`id`, `name`, `type`, `begin_date`, `end_date`, `done_date`, `project_id`, `principal`, `schedule`, `reserved`) VALUES
(1, '修改1、2、4、5、6、8、9、13、15、16、22', 1, '2013-01-06', '2013-01-07', '0000-00-00', 1, '陆国宁', '100%', ''),
(2, '完成新需求13', 1, '2013-01-08', '2013-01-08', '0000-00-00', 1, '陆国宁', '100%', ''),
(3, '完成新需求14，16', 1, '2013-01-09', '2013-01-11', '0000-00-00', 1, '陆国宁', '50%', ''),
(4, '测试任务1修改的问题', 1, '2013-01-08', '2013-01-08', '0000-00-00', 1, '白利伟', '100%', ''),
(5, '测试任务2完成的新需求', 1, '2013-01-09', '2013-01-09', '2013-01-10', 1, '白利伟', '100%', ''),
(6, '测试任务3完成的新需求', 1, '2013-01-14', '2013-01-14', '0000-00-00', 1, '白利伟', '0%', '');

-- --------------------------------------------------------

--
-- Table structure for table `ih_users`
--

DROP TABLE IF EXISTS `ih_users`;
CREATE TABLE IF NOT EXISTS `ih_users` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(60) NOT NULL DEFAULT '',
  `user_pass` varchar(64) NOT NULL DEFAULT '',
  `user_nicename` varchar(50) NOT NULL DEFAULT '',
  `user_email` varchar(100) NOT NULL DEFAULT '',
  `user_url` varchar(100) NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_lasttime_login` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_activation_key` varchar(60) NOT NULL DEFAULT '',
  `user_status` int(11) NOT NULL DEFAULT '0',
  `user_login_times` bigint(20) NOT NULL DEFAULT '0',
  `display_name` varchar(250) NOT NULL DEFAULT '',
  `sex` tinyint(4) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `user_login_key` (`user_login`),
  KEY `user_nicename` (`user_nicename`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=88908 ;

--
-- Dumping data for table `ih_users`
--

INSERT INTO `ih_users` (`ID`, `user_login`, `user_pass`, `user_nicename`, `user_email`, `user_url`, `user_registered`, `user_lasttime_login`, `user_activation_key`, `user_status`, `user_login_times`, `display_name`, `sex`) VALUES
(88896, '', 'helloworld', '', 'wsun191@gmail.com', 'www.ihakula.com', '2013-03-27 22:17:03', '2013-03-27 22:17:03', '', 0, 0, '', 0),
(88897, '', 'fc5e038d38a57032085441e7fe7010b0', '', 'wayde', '', '2013-04-01 16:26:02', '2013-04-01 16:26:02', '', 0, 0, '', 0),
(88898, '', 'ec6ef230f1828039ee794566b9c58adc', '', 'sun', '', '2013-04-01 16:54:18', '2013-04-01 17:25:50', '', 0, 3, '', 0),
(88899, '', '0cc175b9c0f1b6a831c399e269772661', '', 'a', '', '2013-04-01 17:58:29', '2013-04-02 23:04:50', '', 0, 10, '', 0),
(88900, '', '92eb5ffee6ae2fec3ad71c777531578f', '', 'b', '', '2013-04-01 18:01:33', '2013-04-01 18:01:33', '', 0, 0, '', 0),
(88901, '', '92eb5ffee6ae2fec3ad71c777531578f', '', 'c', '', '2013-04-01 18:03:12', '2013-04-01 18:03:12', '', 0, 0, '', 0),
(88902, '', '92eb5ffee6ae2fec3ad71c777531578f', '', 'd', '', '2013-04-01 18:03:18', '2013-04-01 18:03:18', '', 0, 0, '', 0),
(88903, '', '8fa14cdd754f91cc6554c9e71929cce7', '', 'f', '', '2013-04-02 16:57:24', '2013-04-02 16:57:24', '', 0, 0, '', 0),
(88904, '', '8fa14cdd754f91cc6554c9e71929cce7', '', 'g', '', '2013-04-02 16:58:23', '2013-04-02 16:58:23', '', 0, 0, '', 0),
(88905, '', 'e1671797c52e15f763380b45e841ec32', '', 'e', '', '2013-04-02 17:00:45', '2013-04-02 17:00:45', '', 0, 0, '', 0),
(88906, '', '9e3669d19b675bd57058fd4664205d2a', '', '女', '', '2013-04-02 17:16:18', '2013-04-02 17:16:18', '', 0, 0, '', 0),
(88907, '', '0cc175b9c0f1b6a831c399e269772661', '', '女的', '', '2013-04-05 12:11:00', '2013-04-05 12:11:00', '', 0, 0, '', 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
