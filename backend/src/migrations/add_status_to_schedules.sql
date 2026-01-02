-- Migration: Add status column to Schedules table
-- Run this SQL if you're not using Sequelize migrations

-- For MySQL
ALTER TABLE Schedules 
ADD COLUMN status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved' 
COMMENT 'Trạng thái duyệt: pending (chờ duyệt), approved (đã duyệt), rejected (từ chối)';

-- Update existing records to 'approved' (already done by default)
-- UPDATE Schedules SET status = 'approved' WHERE status IS NULL;
