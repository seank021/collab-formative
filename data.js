
window.experimentData = [
  // Trial 1 — Early divergence (쟁점 형성 단계)
  {
    context:
      "This meeting aims to decide whether Feature X should be included in the next release.\n" +
      "The team is under time pressure due to an upcoming deadline.\n" +
      "Participants include a Product Manager (PM), two Engineers (E1, E2), and a Designer (D).\n" +
      "Up to this point, the discussion has explored both benefits and risks of launching Feature X.\n" +
      "You briefly lost focus and are now re-entering the discussion.",
    
    // AI Transcript Image (Displayed as text for now, but placeholder for image)
    image: "https://via.placeholder.com/600x400?text=Trial+1+Transcript",
    
    // Transcript text to be displayed below or instead of image if needed
    transcript: 
      "PM: If we want to hit the deadline, we can’t keep expanding the scope.\n\n" +
      "E1: I understand that, but some parts still feel risky.\n\n" +
      "D: From a user perspective, this feature is pretty central.\n\n" +
      "E2: I’m not sure we’ve fully thought through the failure cases.\n\n" +
      "PM: Right, but delaying also has its own cost.",
    
    // Questions
    q1: "Q1: What is the main point of disagreement in the discussion right now?",
    q2: "Q2: Write ONE sentence you would say to re-enter the discussion at this moment.",
    q3: "Q3: What should the team do next to move toward alignment?",
    
    timeLimit: 3000 // 30 seconds
  },

  // Trial 2 — Role-based misalignment (관점 분화)
  {
    context:
      "The discussion continues on Feature X.\n" +
      "Different participants are emphasizing different concerns, but no decision has been made.\n" +
      "The pace of the conversation has increased.\n" +
      "You briefly lost focus and are now re-entering the discussion.",
    
    image: "https://via.placeholder.com/600x400?text=Trial+2+Transcript",
    transcript:
      "E1: My biggest worry is that we’ll ship something we can’t easily fix later.\n\n" +
      "D: But from a UX standpoint, this is something users have been asking for.\n\n" +
      "PM: I’m trying to balance both, but we don’t have infinite time.\n\n" +
      "E2: Technical debt is going to slow us down either way.\n\n" +
      "PM: Let’s not lose sight of the timeline here.",
    
    q1: "Q1: Which concern does each role seem to emphasize most? (timeline / technical risk / user impact / unclear)",
    q2: "Q2: Write ONE clarifying question you would ask to quickly catch up.",
    q3: "Q3: What is one concrete step the team could take to reduce misunderstanding?",
    
    timeLimit: 3000
  },

  // Trial 3 — Partial convergence, unresolved tension
  {
    context:
      "The team appears to agree that meeting the deadline is important.\n" +
      "However, concerns about long-term quality and risk are still being raised.\n" +
      "The conversation is moving quickly.\n" +
      "You briefly lost focus and are now re-entering the discussion.",
    
    image: "https://via.placeholder.com/600x400?text=Trial+3+Transcript",
    transcript:
      "PM: So I think we all agree we can’t miss the deadline again.\n\n" +
      "E2: Yes, but I’m still uncomfortable with how little testing we’ve done.\n\n" +
      "D: I’m okay with cutting some polish if the core experience is solid.\n\n" +
      "E1: I just don’t want us to regret this decision later.\n\n" +
      "PM: Okay, but we need to land somewhere soon.",
    
    q1: "Q1: What seems to be agreed upon, and what remains unresolved?",
    q2: "Q2: Summarize the current discussion in ONE sentence as if explaining it to someone who just joined.",
    q3: "Q3: What question must be answered before the team can make a decision?",
    
    timeLimit: 3000
  },

  // Trial 4 — Fragile alignment (암묵적 합의)
  {
    context:
      "The team is approaching the end of the meeting.\n" +
      "Some possible compromises have been mentioned, but no one has stated a final position.\n" +
      "Time is running out.\n" +
      "You briefly lost focus and are now re-entering the discussion.",
    
    image: "https://via.placeholder.com/600x400?text=Trial+4+Transcript",
    transcript:
      "D: If we scope it down a bit, I think users would still find it valuable.\n\n" +
      "E1: That could work, but it doesn’t eliminate all the risk.\n\n" +
      "PM: It might be the best balance we can get right now.\n\n" +
      "E2: I’m not fully convinced, but I see the argument.\n\n" +
      "PM: We don’t have much time left.",
    
    q1: "Q1: Is the team aligned enough to make a decision right now? Why or why not?",
    q2: "Q2: Write ONE sentence you could say now without disrupting the discussion flow.",
    q3: "Q3: What is the risk of making a decision at this point, and how could it be mitigated?",
    
    timeLimit: 3000
  },

  // Trial 5 — Decision pressure (종결 or 유예)
  {
    context:
      "Only a few minutes remain in the meeting.\n" +
      "The team must either commit to a decision or defer it.\n" +
      "You briefly lost focus and are now re-entering the discussion.",
    
    image: "https://via.placeholder.com/600x400?text=Trial+5+Transcript",
    transcript:
      "PM: We need to wrap this up.\n\n" +
      "E2: I still have reservations, but I don’t see a perfect option.\n\n" +
      "D: If we don’t ship now, I worry we’ll lose momentum.\n\n" +
      "E1: I can live with it if we’re clear about the risks.\n\n" +
      "PM: Okay… so where does that leave us?",
    
    q1: "Q1: What options are still realistically on the table at this moment?",
    q2: "Q2: What would you say if asked for your opinion immediately?",
    q3: "Q3: Who should take ownership of the next step, and what should they do?",
    
    timeLimit: 3000
  }
];

