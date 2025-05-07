-- Insert time slots into Allcodes table
INSERT INTO `Allcodes` (`keyMap`, `type`, `valueEn`, `valueVi`, `createdAt`, `updatedAt`)
VALUES 
    ('T1', 'TIME', '08:00 - 09:00', '08:00 - 09:00', NOW(), NOW()),
    ('T2', 'TIME', '09:00 - 10:00', '09:00 - 10:00', NOW(), NOW()),
    ('T3', 'TIME', '10:00 - 11:00', '10:00 - 11:00', NOW(), NOW()),
    ('T4', 'TIME', '11:00 - 12:00', '11:00 - 12:00', NOW(), NOW()),
    ('T5', 'TIME', '13:00 - 14:00', '13:00 - 14:00', NOW(), NOW()),
    ('T6', 'TIME', '14:00 - 15:00', '14:00 - 15:00', NOW(), NOW()),
    ('T7', 'TIME', '15:00 - 16:00', '15:00 - 16:00', NOW(), NOW()),
    ('T8', 'TIME', '16:00 - 17:00', '16:00 - 17:00', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `valueEn` = VALUES(`valueEn`),
    `valueVi` = VALUES(`valueVi`),
    `updatedAt` = NOW(); 