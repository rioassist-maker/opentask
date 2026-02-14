# Multi-Agent Setup for OpenTask

This guide explains how to configure multiple AI agents to use OpenTask with individual accounts for tracking and attribution.

## Overview

Use Gmail+ aliasing to create separate accounts for each agent while routing all emails to a single inbox:
- Human: `your-email@gmail.com`
- PM Agent: `your-email+pm@gmail.com`
- Developer Agent: `your-email+dev@gmail.com`
- Test Architect: `your-email+test@gmail.com`
- Code Reviewer: `your-email+reviewer@gmail.com`

## Benefits

✅ **Single Inbox** - All emails route to your main Gmail inbox  
✅ **Clear Attribution** - See which agent created/claimed each task  
✅ **Easy Management** - One password to manage, no separate accounts  
✅ **Built-in Filtering** - Gmail automatically recognizes +aliases for filters  

## Setup Steps

### 1. Create Agent Accounts

Sign up each agent manually in OpenTask:

1. Go to https://your-opentask-instance.com/signup
2. Create accounts:
   - `your-email+pm@gmail.com` (password: same for all)
   - `your-email+dev@gmail.com`
   - `your-email+test@gmail.com`
   - `your-email+reviewer@gmail.com`

### 2. Configure OpenClaw Gateway

Edit your OpenClaw gateway configuration (`~/.openclaw/config.yaml`):

```yaml
agents:
  - id: main
    # Your main agent (optional: can use human account or separate)
    
  - id: pm
    name: "Project Manager"
    model: anthropic/claude-sonnet-4-5
    env:
      OPENTASK_EMAIL: your-email+pm@gmail.com
      OPENTASK_PASSWORD: your-shared-agent-password
      OPENTASK_API_URL: https://your-opentask-instance.com
    
  - id: developer
    name: "Developer"
    model: anthropic/claude-haiku-4-5
    env:
      OPENTASK_EMAIL: your-email+dev@gmail.com
      OPENTASK_PASSWORD: your-shared-agent-password
      OPENTASK_API_URL: https://your-opentask-instance.com
    
  - id: test-architect
    name: "Test Architect"
    model: anthropic/claude-haiku-4-5
    env:
      OPENTASK_EMAIL: your-email+test@gmail.com
      OPENTASK_PASSWORD: your-shared-agent-password
      OPENTASK_API_URL: https://your-opentask-instance.com
    
  - id: reviewer
    name: "Code Reviewer"
    model: anthropic/claude-sonnet-4-5
    env:
      OPENTASK_EMAIL: your-email+reviewer@gmail.com
      OPENTASK_PASSWORD: your-shared-agent-password
      OPENTASK_API_URL: https://your-opentask-instance.com
```

### 3. Restart Gateway

After updating config:

```bash
openclaw gateway restart
```

## Usage

Once configured, each agent automatically uses their own credentials when calling the OpenTask CLI:

```bash
# PM agent creates a task - will show as created by pm@...
opentask create "Design new feature" "Spec out the architecture"

# Developer claims it - will show as claimed by dev@...
opentask claim <task-id>

# Test Architect creates test plan task
opentask create "Write test plan" --project <project-id>
```

## Verification

Check that agents are using separate accounts:

1. **CLI Test:**
   ```bash
   opentask list
   ```
   Should show tasks with different `created_by` values

2. **Web UI:**
   - Go to https://your-opentask-instance.com/dashboard
   - Check "Created By" and "Claimed By" columns
   - Should see different agent emails

3. **API Test:**
   ```bash
   curl https://your-opentask-instance.com/api/collections/tasks/records | jq '.items[] | {title, created_by, claimed_by}'
   ```

## Troubleshooting

### "Missing required environment variables" error

Environment variables are not set for that agent. Check:
1. Agent ID in config matches the one being used
2. Variables are nested under correct agent ID
3. Gateway was restarted after config changes

### Tasks showing wrong user

The skill might be using cached credentials. Clear token cache:

```bash
rm ~/.openclaw/skills/opentask/.token
```

### Gmail not receiving emails

If PocketBase is configured to send emails:
1. Check Gmail spam folder
2. All +alias emails route to base address automatically
3. Create filter in Gmail to label by alias if needed

## Security Notes

- **Password:** Use a strong shared password for all agent accounts
- **Token Storage:** Tokens are cached in `~/.openclaw/skills/opentask/.token` per agent
- **API Access:** Each agent has full API access with their credentials
- **Revocation:** Revoke access by changing password in OpenTask UI

## Alternative: Manual Configuration

If you prefer not to use gateway config, you can set environment variables when spawning sub-agents:

```yaml
# In your orchestrator agent
sessions_spawn:
  agentId: developer
  task: "Fix the bug"
  env:
    OPENTASK_EMAIL: your-email+dev@gmail.com
    OPENTASK_PASSWORD: password
```

This approach gives you per-task control but requires manual setup each time.

## Related Documentation

- [OpenTask CLI Documentation](./README.md)
- [OpenClaw Multi-Agent Documentation](https://docs.openclaw.ai/concepts/multi-agent)
- [Agent Environment Variables](https://docs.openclaw.ai/config/agents#environment-variables)
