import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  /**
   * Get profile by user ID
   */
  static async getProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new profile
   */
  static async createProfile(profileData: ProfileInsert): Promise<ProfileRow> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing profile
   */
  static async updateProfile(userId: string, updates: ProfileUpdate): Promise<ProfileRow> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a profile
   */
  static async deleteProfile(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }

  /**
   * Get profiles by city (for finding potential flatmates)
   */
  static async getProfilesByCity(city: string): Promise<ProfileRow[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('city', city)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch profiles by city: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Search profiles by profession
   */
  static async searchProfilesByProfession(profession: string): Promise<ProfileRow[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('profession', `%${profession}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search profiles by profession: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Update profile verification status
   */
  static async updateVerificationStatus(userId: string, isVerified: boolean): Promise<ProfileRow> {
    return this.updateProfile(userId, { is_verified: isVerified });
  }

  /**
   * Get verified profiles
   */
  static async getVerifiedProfiles(): Promise<ProfileRow[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch verified profiles: ${error.message}`);
    }

    return data || [];
  }
}