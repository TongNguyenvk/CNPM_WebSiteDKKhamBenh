-- Add maxNumber and currentNumber columns to Schedules table
ALTER TABLE `Schedules`
ADD COLUMN `maxNumber` INT NOT NULL DEFAULT 1,
ADD COLUMN `currentNumber` INT NOT NULL DEFAULT 0;

-- Add check constraint to ensure maxNumber is positive
ALTER TABLE `Schedules`
ADD CONSTRAINT `check_max_number_positive` 
CHECK (`maxNumber` > 0);

-- Add check constraint to ensure currentNumber is not negative
ALTER TABLE `Schedules`
ADD CONSTRAINT `check_current_number_not_negative` 
CHECK (`currentNumber` >= 0);

-- Add check constraint to ensure currentNumber doesn't exceed maxNumber
ALTER TABLE `Schedules`
ADD CONSTRAINT `check_current_number_not_exceed_max` 
CHECK (`currentNumber` <= `maxNumber`);

-- Update existing records to have default values
UPDATE `Schedules`
SET 
    `maxNumber` = 1,
    `currentNumber` = 0
WHERE `maxNumber` IS NULL OR `currentNumber` IS NULL; 