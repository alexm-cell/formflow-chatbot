import { NextResponse } from 'next/server';
import { forms, Form } from '@/lib/store';
export async function GET() { return NextResponse.json(forms); }
