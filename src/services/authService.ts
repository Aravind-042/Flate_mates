import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: 'flat_seeker' | 'flat_owner';
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpData): Promise<{ user: User | null; session: Session | null }> {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: data.fullName,
          role: data.role
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return authData;
  }

  /**
   * Sign in an existing user
   */
  static async signIn(data: SignInData): Promise<{ user: User | null; session: Session | null }> {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return authData;
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    // Clear local storage and force reload
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/");
  }

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(error.message);
    }

    return session;
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(error.message);
    }

    return user;
  }

  /**
   * Update user password
   */
  static async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Update user email
   */
  static async updateEmail(newEmail: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ 
      email: newEmail 
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}