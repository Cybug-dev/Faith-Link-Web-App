// Shapes the church API will fill; components depend on these, not on the sample data.

export type ChurchStat = {
  id: 'members' | 'leaders' | 'groups' | 'founded'
  value: string
  label: string
}

export type ChurchLeader = {
  id: string
  name: string
  role: string
  photo: string
}

export type ChurchVerse = { text: string; reference: string }

export type Church = {
  name: string
  tagline: string
  about: string
  coverVerse: ChurchVerse
  aboutVerse: ChurchVerse
  cover: { src: string; alt: string; srcSet?: string }
  stats: readonly ChurchStat[]
  leaders: readonly ChurchLeader[]
}
