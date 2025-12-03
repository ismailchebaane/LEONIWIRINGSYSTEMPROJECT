# config.py

FEATURES = [
    'plant', 'process', 'master_data_name', 'location',
    'year', 'equipment_commercialized', 'pdr_commercialized',
     'production_hours',
    'replacement_parts', 'maintenance_mttr_mtbf'
]

CATEGORICAL_FEATURES = ['plant', 'process', 'master_data_name', 'location']

DROP_COLUMNS = [
    'immobilization_number', 'serial_number','hp_coefficient','age',
    'degradability', 'aging_result', 'equipment_status', 'technology'
]
