# Comprehensive User Activity Tracking & Analytics Design

## Scenario Overview

Our EdTech platform requires robust tracking of both student and teacher activities to enable personalized learning, identify improvement areas, and generate actionable reports. This document outlines the metadata to capture for each activity, the recommended storage strategy across PostgreSQL, Azure Tables, and Redis, and the rationale for each choice.

---

## 1. Student Activity Tracking

### A. Lesson Progress

**Metadata to Capture:**

- `student_id`
- `lesson_id`
- `started_at` (timestamp)
- `completed_at` (timestamp, nullable)
- `progress_percent` (float)
- `video_watch_time` (seconds)
- `sections_read` (array of section IDs or names)
- `last_accessed_at` (timestamp)

**Database Choice & Justification:**

- **PostgreSQL:**
  - **Why:** Relational structure, supports complex queries (e.g., progress over time, cohort analysis), transactional integrity.
  - **Usage:** Analytics, reporting, personalized recommendations, progress dashboards.
- **Redis:**
  - **Why:** For real-time progress updates (e.g., live dashboards, in-lesson progress bars).
  - **Usage:** Real-time UI updates, quick lookups.
- **Azure Tables:**
  - **Why:** Cost-effective for storing large volumes of semi-structured progress logs, if detailed history is needed for compliance/auditing.
  - **Usage:** Historical data archiving, compliance.

### B. Quiz Attempts

**Metadata to Capture:**

- `student_id`
- `quiz_id`
- `attempt_id`
- `attempt_number`
- `answers` (JSON: question_id → answer)
- `score`
- `submitted_at` (timestamp)
- `duration_seconds`
- `is_passed` (boolean)

**Database Choice & Justification:**

- **PostgreSQL:**
  - **Why:** Relational, supports joins (e.g., with questions, students), analytics (e.g., average score, attempt patterns).
  - **Usage:** Analytics, reporting, adaptive learning algorithms.
- **Azure Tables:**
  - **Why:** Scalable for storing high-volume attempt logs, especially for audit or export.
  - **Usage:** Bulk export, compliance, backup.
- **Redis:**
  - **Why:** For caching recent attempts or leaderboards.
  - **Usage:** Real-time leaderboards, quick feedback.

### C. Forum Participation

**Metadata to Capture:**

- `user_id` (student)
- `post_id`
- `thread_id`
- `action_type` (post, reply, like)
- `content` (for posts/replies)
- `created_at` (timestamp)
- `parent_post_id` (for replies)

**Database Choice & Justification:**

- **PostgreSQL:**
  - **Why:** Relational, supports threaded discussions, complex queries (e.g., most active users, trending topics).
  - **Usage:** Analytics, moderation, reporting.
- **Redis:**
  - **Why:** For real-time notifications (e.g., new replies, likes).
  - **Usage:** Push notifications, activity feeds.
- **Azure Tables:**
  - **Why:** For archiving forum activity logs.
  - **Usage:** Historical analysis, compliance.

---

## 2. Teacher Activity Tracking

### A. Content Creation

**Metadata to Capture:**

- `teacher_id`
- `content_id`
- `content_type` (lesson, quiz, assignment)
- `action` (created, updated)
- `timestamp`
- `title`
- `changes_summary` (for updates)

**Database Choice & Justification:**

- **PostgreSQL:**
  - **Why:** Relational, supports audit trails, joins with content tables.
  - **Usage:** Analytics, reporting, content management.
- **Azure Tables:**
  - **Why:** For storing change logs at scale.
  - **Usage:** Audit logs, compliance.

### B. Feedback Provided

**Metadata to Capture:**

- `teacher_id`
- `student_id`
- `submission_id`
- `feedback_text`
- `feedback_type` (text, rubric, audio)
- `created_at` (timestamp)
- `score` (if applicable)

**Database Choice & Justification:**

- **PostgreSQL:**
  - **Why:** Relational, supports joins with submissions, students, and teachers.
  - **Usage:** Analytics, reporting, student progress tracking.
- **Azure Tables:**
  - **Why:** For storing large volumes of feedback logs.
  - **Usage:** Historical feedback analysis, compliance.

### C. Live Class Engagement

**Metadata to Capture:**

- `teacher_id`
- `class_id`
- `session_id`
- `joined_at` (timestamp)
- `left_at` (timestamp)
- `duration_seconds`
- `polls_launched` (array of poll IDs)
- `messages_sent` (count)

**Database Choice & Justification:**

- **PostgreSQL:**
  - **Why:** Relational, supports time-series analysis, engagement reporting.
  - **Usage:** Analytics, reporting, teacher performance dashboards.
- **Redis:**
  - **Why:** For real-time engagement tracking (e.g., live dashboards, alerts).
  - **Usage:** Real-time monitoring, notifications.
- **Azure Tables:**
  - **Why:** For archiving session logs.
  - **Usage:** Historical analysis, compliance.

---

## Summary Table

| Activity              | Metadata Highlights              | PostgreSQL (Relational) | Azure Tables (Archival/Scale) | Redis (Real-Time) |
| --------------------- | -------------------------------- | :---------------------: | :---------------------------: | :---------------: |
| Lesson Progress       | Progress %, watch time, sections |           ✔️            |              ✔️               |        ✔️         |
| Quiz Attempts         | Answers, score, time             |           ✔️            |              ✔️               |        ✔️         |
| Forum Participation   | Posts, replies, likes            |           ✔️            |              ✔️               |        ✔️         |
| Content Creation      | Action, type, changes            |           ✔️            |              ✔️               |                   |
| Feedback Provided     | Feedback, type, score            |           ✔️            |              ✔️               |                   |
| Live Class Engagement | Duration, polls, messages        |           ✔️            |              ✔️               |        ✔️         |

---

## Usage Scenarios

- **Analytics & Reporting:** PostgreSQL is the primary source for complex queries, aggregations, and generating reports for both students and teachers.
- **Personalization & Recommendations:** Data from PostgreSQL and Redis is used to tailor learning paths and suggest content.
- **Real-Time Dashboards:** Redis powers live updates for progress bars, leaderboards, and engagement dashboards.
- **Compliance & Archival:** Azure Tables store historical logs and activity data for auditing and compliance at scale.

---

## Best Practices

- Use PostgreSQL for transactional, relational, and analytical needs.
- Use Redis for caching, real-time updates, and ephemeral data.
- Use Azure Tables for cost-effective, scalable storage of logs and historical data.
- Regularly ETL (Extract, Transform, Load) data from Redis to PostgreSQL/Azure Tables for persistence.
- Ensure data privacy and compliance (e.g., GDPR, FERPA) in all tracking and storage.

---

## Example Entity: Lesson Progress (PostgreSQL Table)

```sql
CREATE TABLE lesson_progress (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    progress_percent FLOAT,
    video_watch_time INT,
    sections_read TEXT[],
    last_accessed_at TIMESTAMP
);
```

---

## Conclusion

This strategy ensures robust, scalable, and cost-effective tracking of user activities, supporting both real-time and analytical needs for a modern EdTech platform.
