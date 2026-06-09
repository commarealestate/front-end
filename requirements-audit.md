# CRM & Website Requirements Tracker

Review date: 2026-06-08

Source document:
- `CRM & Website Issues + New Feature Request.pdf`

This file is the English source of truth for the CRM and website requirements. It tracks what the client asked for, the expected behavior, and the current implementation status.

## Status Legend

- `Done`: implemented and verified at code level.
- `Needs verification`: implemented or mostly implemented, but still needs one manual/browser/API verification pass.
- `In progress`: implementation exists but is incomplete.
- `Open`: not implemented yet.

## Section 1: Existing Issues

### 1. Employee Creation Issue

Status: `Done`

Requirement:
- The system must not hang when adding a new employee/agent.
- The UI must show a clear error message when creation fails.
- Validation errors must be visible to the admin.

Likely causes from the requirement:
- API not returning a proper response.
- Database constraint, such as duplicate email.
- Missing required fields.
- Frontend not handling errors properly.

Current implementation notes:
- The agent create path uses backend/admin API.
- Frontend submit state is reset in `finally`, so the form should not stay stuck in loading.
- API errors are parsed and displayed as toast, general form errors, and field-level validation errors.
- Backend request validation exists for agent creation.
- Duplicate agent email validation now uses the real backend `e_mail` column, so duplicate email failures return a validation error instead of a database/runtime failure.

Verification:
- Frontend build passed.
- Backend request/controller syntax checks passed.
- Duplicate email validation is enforced in create and update requests.

Acceptance criteria:
- Creating a valid employee/agent succeeds and redirects back to the list.
- Invalid submission returns a clear message without hanging.
- Duplicate email, if blocked by business rules, returns a field-level email error.

### 2. Property Images Not Displaying In Control Panel

Status: `Done`

Requirement:
- Property images must be visible in the admin/control panel property list and grid.

Likely causes from the requirement:
- Incorrect image URLs.
- Images not uploaded or not saved properly.
- Storage or permissions issue.
- API not returning image paths.
- Mapping issue between backend and frontend.

Current implementation notes:
- Admin property list/grid image mapping has been fixed.
- Property cards now display the expected image source.

Acceptance criteria:
- Admin property grid cards show the correct property image.
- Admin property list/grid uses the same normalized image mapping as public property cards where applicable.

### 3. Agent Profile Issues

Status: `Done`

Requirement:
- Full name must display, not only last name.
- Status must reflect real active/inactive state, not always active.
- Updating an agent must persist all edited fields.
- After refresh, data must not revert.
- Profile image must save and display correctly.

Fields specifically reported as broken:
- Full name.
- Image.
- Other agent fields beyond profession and city.

Current implementation notes:
- Agent store now supports admin CRUD through the backend API.
- Agent full name uses first name, second name/middle name, and last name.
- Image handling supports personal photo and normalized photo fallback.
- Agent form sends all mapped fields through `FormData`.
- Status is mapped through the `active` field.
- Agent ordering and website hierarchy fields were added.
- Work position/job title is displayed in the admin card/list and detail context.

Verification:
- Frontend build passed.
- Agent store and form submit all mapped fields through backend API.
- Backend create/update request validation and resource mapping are in place for profile fields, image fields, status, level, and display order.

Acceptance criteria:
- Agent profile shows full name everywhere.
- Active/inactive status is accurate.
- Every editable field saved by the form persists after refresh.
- Uploaded profile image remains linked to the agent record.

### 4. Missing Dates / Activity Tracking

Status: `Done`

Requirement:
- Admin must have visibility for:
  - Created date.
  - First contact date.
  - Last activity.
  - Last update.
- CRM must support a full activity timeline:
  - Lead Created.
  - WhatsApp Sent.
  - Call Made.
  - Meeting Scheduled.

Impact from the requirement:
- Without this, there is no performance tracking.
- No accountability.
- No way to measure response time or follow-ups.

Current implementation notes:
- Agents and contact messages expose `created_at`, `updated_at`, `first_contact_at`, and `last_activity_at`.
- A dedicated `crm_activities` timeline table exists.
- Timeline records support:
  - `lead_created`
  - `whatsapp_sent`
  - `call_made`
  - `meeting_scheduled`
  - `note`
  - `status_change`
  - `reply_sent`
  - `marked_read`
  - `agent_created`
  - `agent_updated`
- Contact lead creation writes a `lead_created` activity.
- Admin replies write a `reply_sent` activity.
- Marking unread contact messages as read writes a `marked_read` activity.
- Agent creation and update write timeline activities.
- Existing agents and contact messages are backfilled with tracking dates and initial timeline rows.
- Admin agent/contact detail pages display tracking dates and the activity timeline.

Verification:
- Tracking migrations ran locally.
- Authenticated admin API verification passed for agent/contact detail tracking fields and timeline data.
- Frontend production build passed.
- Backend syntax checks passed.

Acceptance criteria:
- Agent/admin detail shows Created Date, First Contact Date, Last Activity, and Last Update.
- Lead/contact detail shows a chronological activity timeline.
- Project and property leads can be tracked back to source and follow-up activity.
- Timeline supports at least Lead Created, WhatsApp Sent, Call Made, and Meeting Scheduled.

### 5. Website Filter Issue: Apartments Not Showing

Status: `Done`

Requirement:
- Apartments must show on the website when filtering by apartment type.
- Admin categorization and public filtering must use compatible values.

Likely causes from the requirement:
- API not returning apartment data.
- Value mismatch, such as `apartment` vs `Apartment` vs `Apartments`.
- Field mismatch, such as `property_type` vs `type`.
- Frontend filter logic issue.
- `Show on Website` flag not applied correctly.

Current implementation notes:
- Frontend property type normalization includes apartment variants.
- Backend property filtering now performs case/plural-tolerant matching for apartment/apartments, villa/villas, and townhouse/townhouses.

Verification:
- Frontend build passed.
- Backend syntax checks passed.
- Backend filter no longer depends on exact stored casing for apartment values.

Acceptance criteria:
- Selecting Apartments on the public site shows apartment listings.
- Filter works regardless of stored value casing if legacy data has mixed values.
- Villas and apartments use the same API/filter contract.

### 6. Agent Page Structure: Levels And Sorting

Status: `Done`

Requirement:
- Agent page must be grouped into:
  - Level 1: Higher Management.
  - Level 2: Management.
  - Level 3: Agents.
- Sorting logic:
  - Sort by CRE ID ascending if reliable.
  - Otherwise sort by joining date ascending.
- Admin must be able to control relative importance/order for website display.

Current implementation notes:
- Agent hierarchy fields exist.
- Display order support exists.
- Website groups agents by level.
- Sorting uses display priority, CRE, and date fallback behavior.
- Backend and frontend both support `website_level` and `display_order`.

Verification:
- Frontend build passed.
- Backend request/resource/controller syntax checks passed.

Acceptance criteria:
- Public agents page shows three hierarchy groups.
- Admin can assign agent level.
- Admin can set display order/importance.
- Agents render in the expected priority order.

## Section 2: Attached Documents - Property Attributes

Status: `In progress`

Documents referenced:
- Resale Attributes.
- Off-plan Attributes.
- Rental Attributes.

Requirement:
- Build pages based on these documents.
- Each property type must display only its relevant attributes.
- No hardcoding.
- Attributes must be fully dynamic from the control panel.

Required behavior:
- Resale properties display only resale-relevant fields.
- Rental properties display only rental-relevant fields.
- Off-plan properties display only off-plan-relevant fields.
- Admin/control panel controls the available attributes and values.
- Website reads from the API/attribute schema instead of hardcoded page sections.

Current implementation notes:
- Property detail page displays many type-specific fields.
- This is not yet a fully dynamic control-panel-driven attribute system.

Remaining work:
- Define backend attribute schema/config per property listing type.
- Add admin controls for attributes.
- Return attribute groups from API.
- Render property attributes dynamically on the website.

Acceptance criteria:
- Adding/removing/reordering an attribute in the control panel changes website display without code changes.
- Resale, rental, and off-plan pages only show their relevant fields.
- No frontend hardcoded field list is required for the final dynamic version.

## Section 3: Projects + Contact Forms

### 1. Objective

Status: `In progress`

Requirement:
- Introduce a module called `Projects` in:
  - Website.
  - Control Panel.

Purpose:
- This is not a blog module.
- Each project is a landing page and lead capture system.

### 2. Project Concept

Status: `In progress`

Each project must have:
- Dedicated page.
- Images.
- Description.
- Project details.
- Contact form.

### 3. Control Panel Requirements

Status: `In progress`

Admin must be able to:
- Create a new project.
- Upload 4 to 5 images.
- Add title.
- Add blog-style/rich description content.
- Set status:
  - Published.
  - Draft.

Current implementation notes:
- Admin project CRUD exists.
- Project status support exists in frontend and backend.
- Image/gallery support exists.
- Project creation now supports uploading up to 5 gallery images with previews and removal before save.

Remaining work:
- Verify rich description editing quality.
- Decide whether the description field must be upgraded from plain textarea to a true rich text/blog-style editor.

### 4. Website Homepage Integration

Status: `Done`

Requirement:
- Add a `Projects` section directly below the homepage hero section.

Display:
- Project image.
- Project name.
- Short description.

On click:
- Navigate to the project page.

Acceptance criteria:
- Homepage shows projects immediately below hero.
- Only published projects appear publicly.
- Project cards link to the correct project detail page.

Verification:
- Homepage includes `ProjectsSection` immediately after `HeroSection`.
- Frontend build passed.
- Backend project status filtering is implemented and migrated.

### 5. Project Page Structure

Status: `Done`

Critical layout requirement:
- First view above the fold must show the contact form immediately.
- Project title, description, and image gallery must be available by scrolling.

Goal:
- User lands on the project page and sees the form immediately.
- If interested, user scrolls to view project details.

Acceptance criteria:
- Project landing page opens with lead capture visible above the fold.
- Project content and gallery remain accessible by scroll.
- The page feels like a conversion landing page, not a blog page.

Verification:
- Project detail page starts with a lead-first hero and visible `ProjectLeadForm`.
- Project title, description, sections, gallery, and details remain available below the first view.
- Frontend build passed.

### 6. Project Contact Form

Status: `Done`

Each project must have its own form.

Fields:
- Name.
- Phone.
- Email.
- Message, optional.

Submission behavior:
- Save data in CRM.
- Link lead to the specific project.
- Save lead source as `Project Page`.

Expected lead payload example:

```json
{
  "name": "Client Name",
  "phone": "+971...",
  "email": "client@example.com",
  "project": "Yas Park",
  "source": "Project Page"
}
```

Current implementation notes:
- Project contact form exists.
- Project metadata has been added to contact/admin message handling.
- Contact admin table displays project information.
- Contact backend search includes project, source, page URL, and UTM fields.

Verification:
- Frontend build passed.
- Backend contact resource/request/controller fields are in place.
- Project lead form submits project ID, project title, source, page URL, and UTM fields.

### 7. Marketing Use Case

Status: `Done`

Requirement:
- Project pages will be used for advertising campaigns and lead generation.
- Campaign traffic will go to:
  - Project Page.
  - Contact Form.

Acceptance criteria:
- Each project page works as a standalone landing page.
- Every campaign lead can be traced to its project.
- CRM can identify source project and source page.
- UTM parameters are stored where available.

Verification:
- Project page is lead-first.
- Contact payload stores project/source/page/UTM metadata.
- Admin contact search and table expose project lead context.

### 8. Final Goal

Status: `In progress`

Final required model:
- Each project equals a landing page.
- Each campaign is linked to a project.
- Each lead is linked to a project.

System integration requirement:
- Control Panel creates and manages projects.
- API exposes project data and receives leads.
- Website renders landing pages and submits leads.
- CRM/admin displays and filters project leads.

## API And Integration Requirements

Status: `In progress`

The final instruction requires developers to:
- Fix all existing issues.
- Establish a clear API structure.
- Implement the Projects module correctly.
- Ensure full integration between:
  - Control Panel.
  - API.
  - Website.

API structure expectations:
- Stable field names.
- Clear response formats.
- Validation errors returned consistently.
- Public endpoints only return published/visible data.
- Admin endpoints expose draft/internal records.
- Contact/project lead payloads preserve source, linked entity, page URL, and UTM data.

Current implementation notes:
- Project status is now persisted and returned by API.
- Project list can filter by `status=Published`.
- Current project detail route is still shared between public and admin, so draft detail visibility should be revisited if strict public hiding is required.

## Priority Order

### P0: Close Existing Issues

- Employee/agent creation final verification.
- Agent profile final verification.
- Property image display final verification.
- Apartment filter verification/fix.
- Agent dates and activity tracking implementation.

### P1: Projects Lead Engine

- Verify project admin CRUD and status.
- Verify homepage project section.
- Ensure project page form is above the fold.
- Verify project lead submission and CRM display.
- Verify filters/search for project leads.

### P1: Dynamic Property Attributes

- Define dynamic attribute schema.
- Add control panel management for attributes.
- Render attributes by property type from API.
- Remove dependency on hardcoded frontend attribute lists.

### P2: API Governance And Cleanup

- Document API contracts for properties, agents, projects, and leads.
- Normalize enum values.
- Remove obsolete copy files after confirming they are unused.
- Fix any remaining encoding/mojibake text in user-facing files.

## Notes For Future Work

- Keep all requirement documentation in English.
- Focus on PDF/client requirements before general improvements.
- Do not treat Projects as a blog feature; it is a lead generation engine.
- Do not hardcode final property attribute behavior; the final target is control-panel-driven dynamic attributes.
