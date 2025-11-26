// Ghostly messages that appear when the user hesitates
export const ghostMessages = [
  "Don't stop.",
  "I'm watching.",
  "Write for us.",
  "It's getting colder.",
  "We are waiting.",
  "Keep writing...",
  "The darkness grows.",
  "They're listening.",
  "Time is running out.",
  "Don't look behind you.",
  "We hunger for words.",
  "The void beckons.",
  "Your deadline approaches.",
  "Feed us your thoughts.",
  "The shadows whisper.",
  "Continue... or else.",
  "We grow impatient.",
  "The clock ticks.",
  "Your soul is ours.",
  "Write or perish.",
];

export function getRandomGhostMessage(): string {
  return ghostMessages[Math.floor(Math.random() * ghostMessages.length)];
}
