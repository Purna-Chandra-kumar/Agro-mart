-- Insert sample delivery partners for testing
INSERT INTO public.delivery_partners (name, phone, location, rating, price_per_km, available) VALUES
('Ravi Transport', '+91 9876543301', '{"lat": 12.9716, "lng": 77.5946, "address": "Bangalore, Karnataka"}', 4.5, 8, true),
('Quick Delivery', '+91 9876543302', '{"lat": 12.9716, "lng": 77.5946, "address": "Bangalore, Karnataka"}', 4.2, 10, true),
('Express Logistics', '+91 9876543303', '{"lat": 12.9716, "lng": 77.5946, "address": "Bangalore, Karnataka"}', 4.8, 12, true),
('Local Transport', '+91 9876543304', '{"lat": 12.9716, "lng": 77.5946, "address": "Bangalore, Karnataka"}', 4.1, 7, true),
('Fast Movers', '+91 9876543305', '{"lat": 12.9716, "lng": 77.5946, "address": "Bangalore, Karnataka"}', 4.6, 9, true);