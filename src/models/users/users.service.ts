import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../../config/supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async create(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: existingUser } = await this.supabase.getClient()
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const { data, error } = await this.supabase.getClient()
      .from('users')
      .insert([
        { email, password: hashedPassword }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async findOne(email: string) {
    const { data, error } = await this.supabase.getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const { data: users, error, count } = await this.supabase.getClient()
      .from('users')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw error;
    }

    return {
      users,
      total: count || 0
    };
  }
}