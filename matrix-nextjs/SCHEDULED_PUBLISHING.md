# Scheduled Publishing System

## Overview

The scheduled publishing system allows administrators to schedule blog posts for automatic publication at a specific date and time. Posts with status `SCHEDULED` and a `scheduledAt` timestamp will be automatically published by a cron job.

## Components

### 1. Cron Endpoint
**File:** `/app/api/cron/publish-scheduled/route.ts`

- **Method:** GET
- **Authentication:** Bearer token via `Authorization` header
- **Secret:** `CRON_SECRET` environment variable
- **Functionality:**
  - Finds all posts with status `SCHEDULED` where `scheduledAt <= now()`
  - Updates status to `PUBLISHED` and sets `publishedAt` to current time
  - Returns count of published posts and their details

**Response Example:**
```json
{
  "message": "Successfully published 2 post(s)",
  "published": 2,
  "posts": [
    {
      "id": 5,
      "title": "Upcoming Training Course",
      "slug": "upcoming-training-2026",
      "scheduledAt": "2026-01-12T10:00:00.000Z",
      "publishedAt": "2026-01-12T10:05:00.000Z"
    }
  ]
}
```

### 2. Schedule Picker Component
**File:** `/components/admin/SchedulePicker.tsx`

React component for selecting publication date and time.

**Props:**
- `value: Date | null` - Current scheduled date/time
- `onChange: (date: Date | null) => void` - Callback when date changes

**Features:**
- Date picker (minimum: today)
- Time picker (HH:mm format)
- Hungarian labels and formatting
- Preview of selected date/time
- Clear button
- Disabled time input until date is selected
- Tailwind CSS styling

## Setup Instructions

### 1. Environment Configuration

Add the cron secret to your `.env` file:

```bash
# Cron job authentication secret
CRON_SECRET=your-secure-random-secret-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2. Cron Job Configuration

Configure a cron job to call the endpoint every 5-15 minutes:

#### Option A: External Cron Service (Recommended for Production)

Use services like:
- **Vercel Cron Jobs** (if deployed on Vercel)
- **EasyCron** (https://www.easycron.com/)
- **Cron-job.org** (https://cron-job.org/)

Configuration:
- URL: `https://yourdomain.com/api/cron/publish-scheduled`
- Method: GET
- Header: `Authorization: Bearer YOUR_CRON_SECRET`
- Interval: Every 5-15 minutes

#### Option B: Server Crontab (ISPConfig/Linux)

Add to crontab:
```bash
# Run every 5 minutes
*/5 * * * * curl -X GET -H "Authorization: Bearer YOUR_CRON_SECRET" https://matrixcbs.com/api/cron/publish-scheduled >/dev/null 2>&1

# Or with more verbose logging
*/5 * * * * curl -X GET -H "Authorization: Bearer YOUR_CRON_SECRET" https://matrixcbs.com/api/cron/publish-scheduled >> /var/log/cron-publish.log 2>&1
```

#### Option C: Vercel Cron (vercel.json)

Create `vercel.json` in project root:
```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Note: Vercel automatically includes the `Authorization` header for configured cron jobs.

### 3. Database Schema

The system uses the existing Prisma schema. Ensure these fields exist:

```prisma
model Post {
  // ... other fields
  status          PostStatus  @default(DRAFT)
  publishedAt     DateTime?   @map("published_at")
  scheduledAt     DateTime?   @map("scheduled_at")

  @@index([status, publishedAt])
  @@index([scheduledAt])
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  ARCHIVED
}
```

## Usage in Admin Interface

### Integration Example

```tsx
import SchedulePicker from '@/components/admin/SchedulePicker'
import { PostStatus } from '@prisma/client'

function PostEditor() {
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null)
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT)

  // Update status when scheduled date is set
  useEffect(() => {
    if (scheduledAt && status === PostStatus.DRAFT) {
      setStatus(PostStatus.SCHEDULED)
    }
  }, [scheduledAt])

  const handleSubmit = async () => {
    const postData = {
      // ... other fields
      status: scheduledAt ? PostStatus.SCHEDULED : status,
      scheduledAt: scheduledAt ? scheduledAt.toISOString() : null,
    }

    await fetch('/api/admin/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields */}

      <SchedulePicker
        value={scheduledAt}
        onChange={setScheduledAt}
      />

      <button type="submit">Save Post</button>
    </form>
  )
}
```

## Security Considerations

1. **Cron Secret:** Keep `CRON_SECRET` secure and never commit it to version control
2. **Token Validation:** The endpoint validates the Bearer token on every request
3. **Method Restriction:** Only GET requests are allowed
4. **Logging:** All publishing activities are logged with timestamps
5. **Error Handling:** Comprehensive error handling with appropriate HTTP status codes

## Monitoring

### Success Indicators
- HTTP 200 response
- JSON response with `published` count
- Console logs showing published post details

### Error Scenarios

| Status Code | Error | Solution |
|-------------|-------|----------|
| 401 | Unauthorized | Check `CRON_SECRET` configuration and Authorization header |
| 500 | Server Error | Check database connection and Prisma schema |
| 500 | CRON_SECRET not configured | Add `CRON_SECRET` to environment variables |

## Testing

### Manual Testing

Test the cron endpoint manually:

```bash
# Test with valid secret
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://yourdomain.com/api/cron/publish-scheduled

# Test with invalid secret (should return 401)
curl -X GET \
  -H "Authorization: Bearer wrong-secret" \
  https://yourdomain.com/api/cron/publish-scheduled

# Test without authorization (should return 401)
curl -X GET https://yourdomain.com/api/cron/publish-scheduled
```

### Create Test Scheduled Post

```sql
-- Update a post to be scheduled for 1 minute ago (should publish on next cron run)
UPDATE posts
SET status = 'SCHEDULED',
    scheduled_at = DATE_SUB(NOW(), INTERVAL 1 MINUTE)
WHERE id = YOUR_POST_ID;
```

## Troubleshooting

### Posts Not Publishing

1. **Check cron job is running:**
   ```bash
   # Check cron logs
   tail -f /var/log/cron
   # or
   tail -f /var/log/cron-publish.log
   ```

2. **Verify environment variable:**
   ```bash
   echo $CRON_SECRET
   ```

3. **Test endpoint manually** (see Testing section)

4. **Check database:**
   ```sql
   SELECT id, title, status, scheduled_at, published_at
   FROM posts
   WHERE status = 'SCHEDULED'
   AND scheduled_at <= NOW();
   ```

5. **Check application logs** for error messages

### Common Issues

- **Time Zone Mismatch:** Ensure server time zone matches expected time zone (Europe/Budapest for this project)
- **Database Connection:** Verify `DATABASE_URL` is correctly configured
- **Cron Frequency:** If posts publish late, increase cron frequency (e.g., every 5 minutes instead of 15)

## Future Enhancements

- Email notifications when posts are published
- Dashboard showing upcoming scheduled posts
- Ability to preview scheduled posts before publication
- Automatic social media posting upon publication
- Retry mechanism for failed publications
- Webhook notifications to external systems
