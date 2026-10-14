import { NextResponse } from 'next/server';
import { submissions } from '@/lib/store';
export async function GET() { return NextResponse.json(submissions); }
