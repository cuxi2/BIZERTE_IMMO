-- =========================================
-- SQL SCRIPT TO CREATE ADMIN USER DIRECTLY IN SUPABASE
-- =========================================

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- 1. Créer l'utilisateur dans auth.users
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, aud, role
  )
  VALUES (
    gen_random_uuid(),
    'admin@meftahi-immo.tn', -- Email de l'administrateur
    crypt('SecurePass123!', gen_salt('bf')), -- Mot de passe sécurisé
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name": "Admin User", "phone": "+216XXXXXXXX", "email_verified": true}',
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO new_user_id;

  -- 2. Créer le profil admin lié
  INSERT INTO public.profiles (
    id, full_name, phone, role, created_at
  )
  VALUES (
    new_user_id,
    'Admin User', -- Nom affiché
    '+216XXXXXXXX', -- Numéro de téléphone
    'admin', -- Rôle administrateur
    NOW()
  );
  
  RAISE NOTICE '✅ Admin user created successfully with ID: %', new_user_id;
  RAISE NOTICE '📧 Email: admin@meftahi-immo.tn';
  RAISE NOTICE '🔑 Password: SecurePass123!';
  RAISE NOTICE '🚀 You can now log in at http://localhost:3001/login';
  
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE '⚠️ User already exists. Updating existing profile to admin...';
    -- Si l'utilisateur existe déjà, mettre à jour son profil
    UPDATE public.profiles 
    SET role = 'admin', full_name = 'Admin User', phone = '+216XXXXXXXX'
    WHERE id = (
      SELECT id FROM auth.users WHERE email = 'admin@meftahi-immo.tn' LIMIT 1
    );
    RAISE NOTICE '✅ Profile updated to admin role';
    
  WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Error creating admin user: %', SQLERRM;
END $$;