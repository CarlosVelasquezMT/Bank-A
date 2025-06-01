// filepath: src/auth.js
import { supabase } from './supabaseClient';

// Registrar un nuevo usuario
export const signUp = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return user;
};

// Iniciar sesión
export const signIn = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });
  if (error) throw error;
  return user;
};

// Cerrar sesión
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

const getAccounts = async () => {
  const { data, error } = await supabase.from('accounts').select('*');
  if (error) throw error;
  return data; // Solo devuelve las cuentas del usuario autenticado gracias a RLS
};