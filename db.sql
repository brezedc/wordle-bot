CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `wins` int(11) DEFAULT 0,
  `attempts` int(11) DEFAULT 0,
  `record` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4