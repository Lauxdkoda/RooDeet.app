import test from 'node:test'
import assert from 'node:assert/strict'
import { initialsFromName, normalizeEmail, validateCredentials } from '../src/lib/authRules.js'

test('normalizes email before authentication', () => {
  assert.equal(normalizeEmail('  Student@Example.COM  '), 'student@example.com')
})

test('rejects an invalid email', () => {
  assert.equal(validateCredentials('not-an-email', 'password123').valid, false)
})

test('rejects a short password before sending a request', () => {
  assert.equal(validateCredentials('student@example.com', 'short').valid, false)
})

test('accepts a valid credential shape', () => {
  assert.equal(validateCredentials('student@example.com', 'Learn123!').valid, true)
})

test('creates two-letter learner initials', () => {
  assert.equal(initialsFromName('David Adeyemi'), 'DA')
})
