// MATRIX CBS - API Utility Függvények
// Helper függvények API route-okhoz UTF-8 charset támogatással

import { NextResponse } from 'next/server'

/**
 * JSON response UTF-8 charset header-rel
 * Biztosítja a magyar ékezetes karakterek helyes megjelenítését
 *
 * @example
 * return jsonResponse({ message: 'Sikeres művelet' })
 * return jsonResponse({ error: 'Hiba történt' }, { status: 500 })
 */
export function jsonResponse<T>(data: T, init?: ResponseInit): NextResponse<T> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json; charset=utf-8')

  return NextResponse.json(data, {
    ...init,
    headers,
  })
}

/**
 * Sikeres JSON response (200 OK)
 */
export function successResponse<T>(data: T): NextResponse<T> {
  return jsonResponse(data)
}

/**
 * Létrehozva JSON response (201 Created)
 */
export function createdResponse<T>(data: T): NextResponse<T> {
  return jsonResponse(data, { status: 201 })
}

/**
 * Hibás kérés response (400 Bad Request)
 */
export function badRequestResponse(error: string): NextResponse<{ error: string }> {
  return jsonResponse({ error }, { status: 400 })
}

/**
 * Nem található response (404 Not Found)
 */
export function notFoundResponse(error: string = 'Nem található'): NextResponse<{ error: string }> {
  return jsonResponse({ error }, { status: 404 })
}

/**
 * Szerver hiba response (500 Internal Server Error)
 */
export function serverErrorResponse(error: string = 'Szerverhiba történt'): NextResponse<{ error: string }> {
  return jsonResponse({ error }, { status: 500 })
}
