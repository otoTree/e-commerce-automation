import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

// GET /api/health - 健康检查
export async function GET(request: NextRequest) {
  try {
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Health check API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '健康检查失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}