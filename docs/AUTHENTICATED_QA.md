# Authenticated Browser QA Report

**Test date:** 2026-11-18  
**Environment:** Local MovieLandia24 app at `http://localhost:4000`  
**Method:** Manual browser testing with the seeded `test1` and `test2` accounts

This report records the authenticated and authentication-related flows exercised in the browser, the issues found and fixed during testing, the final data cleanup, and the known coverage limits. It is a record of the tested flows, not a claim that every route or possible input has been exhaustively tested.

## Results at a glance

The tested flows below worked after the fixes described in this report. Temporary QA topics, posts, replies, reviews, lists, messages, and movie bookmarks were removed. The test profile's original username and bio were restored. The browser was left signed in as `test1` on that user's profile.

## Browser test coverage

### Login, registration, and route protection

- **Invalid login:** Submitted invalid credentials. The app stayed on `/login` and displayed an “Invalid credentials” message; the request returned HTTP 401.
- **Successful login:** Signed in as `test1` and confirmed navigation to the app.
- **Registration validation:** Submitted the registration form empty and confirmed required-field validation appeared.
- **Duplicate registration:** Submitted valid form data using the existing seeded account's email. Before the fix, this produced an HTTP 500 and “User already exists.” After the fix, the form displayed “An account with this email already exists.” without a 500. No account or verification email was created.
- **Protected messages route:** Signed out and opened `/messages`. Before the fix, the page reached Prisma with a missing user ID and returned a 500. After the fix, it redirected to `/login`. Authenticated message routes were also exercised below.

### Profile and social features

- **Profile editing:** Changed the test username and bio, verified the updated values, then restored the original username and bio.
- **Profile sections:** Opened the Bookmarks, Upvotes, Downvotes, Reviews, and Forum sections. Within the bookmark area, exercised the Movies, Series, Seasons, Episodes, Actors, and Crew category tabs.
- **Follower pages:** Opened Followers and Following and verified their empty states for the test account.
- **Follow/unfollow:** Followed `test2`, verified the requested state and success feedback, then unfollowed and verified the resulting state and confirmation.

### Bookmarks

- Added movie bookmarks and confirmed they appeared on the profile.
- Removed the temporary movie bookmarks and confirmed the movie-bookmark view returned to its empty state.
- An existing Attack on Titan bookmark was observed during testing and left unchanged.

### Lists and ordering

- Created temporary lists, added movies, and opened the list edit dialog.
- Opened the share-list user search and reorder mode. No list was shared.
- Added a movie through the add-items flow and verified it appeared on the destination list.
- Dragged list items into a different order, saved, reloaded, and confirmed the new order persisted.
- Sorted lists by Name in ascending and descending order.
- Tested an obsolete/invalid `listsSortBy=rating` query value. Before the fix, the unsupported Prisma sort field could make the page appear empty. After the fix, invalid values fell back to a supported sort and the lists remained visible.
- Removed all temporary QA lists and confirmed the profile displayed “No Lists Found.”

### Forum

- Created, edited, and deleted a forum topic.
- Created, edited, and deleted a post on the topic.
- Created, edited, and deleted a reply.
- Confirmed deleted content disappeared after the UI refreshed and the topic was no longer present in its category.

### Reviews and voting

- Created and edited a temporary review for movie 17.
- Using the second seeded account, upvoted the review, changed the vote to a downvote, and removed the vote.
- Confirmed vote counts returned to zero, then deleted the temporary review and confirmed the movie's review count returned to zero.

### Messages

- Composed a draft without sending during an initial UI check.
- In the end-to-end pass, sent a message between the two seeded accounts, verified receipt in the other account's inbox, and exercised read status, reply, edit, and delete.
- Confirmed the message was no longer incorrectly labeled “Edited” immediately after creation and that previews rendered spaces instead of the literal `&nbsp;` entity.
- Deleted the QA messages. Final checks showed “No messages received” in the inbox and “No messages found” in sent messages.

## Issues found and addressed

- **Duplicate registration error:** Existing-email signup errors were surfaced as an unhandled server failure. Signup now returns a visible duplicate-email error to the form.
- **List add-item navigation:** Successful addition could leave the user on the add-items route. The flow now returns to the list; the added item was verified on the destination page.
- **Rich-text editor warnings:** Repeated mention-format registration and invalid keyboard bindings generated Quill warnings. Registration is guarded and the invalid bindings were removed.
- **Missing profile avatars:** Requests for unavailable avatar images returned 404s. The UI now uses its initials fallback instead.
- **List sorting:** The list sort menu included an unsupported Rating field. Supported list fields and invalid-query fallbacks were corrected, and the default order was aligned.
- **Message creation label:** Newly created messages could show an “Edited” timestamp immediately. New messages now start without that edit timestamp; subsequent edits remain distinguishable.
- **Message preview whitespace:** Previews could expose `&nbsp;` instead of spaces. The entity is normalized before the preview is rendered.
- **Unauthenticated messages page:** A missing session could trigger a Prisma validation error. The page now redirects before querying message data.

## Automated validation

After the code fixes:

- `npx tsc --noEmit` passed.
- Targeted ESLint on the changed files passed.
- Focused Vitest coverage passed: 2 files and 3 tests, covering list sort options and list reordering.
- `git diff --check` passed for the implementation changes.

These checks supplement the manual browser scenarios; they do not replace them.

## Observations and limitations

- Some route transitions logged Next.js `ERR_ABORTED` requests while navigation was in progress. The expected pages rendered after transitions settled, so these were treated as navigation cancellations rather than confirmed application failures.
- Generic browser-console 404 messages were observed intermittently. A fresh profile navigation did not reproduce an HTTP response with status 400 or above; the source of those console messages remains unidentified.
- The sent-message list could briefly appear empty immediately after sending. The message appeared after reload; this transient behavior was not conclusively diagnosed or changed.
- A new-account registration and its verification-email delivery were not tested. Password reset, OAuth login, admin-only flows, and a complete audit of public routes were also not covered.
- Browser testing used the local app and seeded accounts; it does not establish production behavior across browsers, devices, or deployment environments.
