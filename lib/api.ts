import { supabase } from './supabase';
import { TicketCategory, TicketUrgency } from './types';

export interface VoiceToTicketResult {
  transcription: string;
  category: TicketCategory;
  subcategory: string;
  urgency: TicketUrgency;
  flatNumber: string;
  descriptionEnglish: string;
  summaryHindi: string;
  confidence: number;
}

export interface ApiError {
  code: string;
  message: string;
}

/**
 * Transcribe and classify voice complaints using Supabase Edge Functions
 */
export async function transcribeAndClassify(
  audioUri: string,
  userFlat: string,
  userId: string,
): Promise<VoiceToTicketResult> {
  const filename = audioUri.split('/').pop() ?? 'recording.m4a';
  
  // 1. Upload audio to Supabase Storage
  const fileData = {
    uri: audioUri,
    name: filename,
    type: 'audio/mp4',
  } as unknown as Blob;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('complaints')
    .upload(`${userId}/${filename}`, fileData);

  if (uploadError) throw uploadError;

  // 2. Call Edge Function to process
  const { data, error } = await supabase.functions.invoke('process-voice-ticket', {
    body: { 
      filePath: uploadData.path,
      flatNumber: userFlat,
      userId 
    },
  });

  if (error) throw error;
  return data as VoiceToTicketResult;
}

/**
 * Fetch AI-generated society briefing
 */
export async function fetchDramaFilter(): Promise<unknown> {
  const { data, error } = await supabase.functions.invoke('drama-filter');
  if (error) throw error;
  return data;
}

/**
 * Ask the Bylaw Bot a question
 */
export async function queryBylaws(
  query: string,
  lang: 'en' | 'hi' = 'en',
): Promise<{ text: string; citation?: string }> {
  const { data, error } = await supabase.functions.invoke('bylaw-bot', {
    body: { query, lang },
  });

  if (error) throw error;
  return data;
}

/**
 * Database Fetchers
 */

export async function fetchTickets(societyId: string) {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('society_id', societyId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchNotices(societyId: string) {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('society_id', societyId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
