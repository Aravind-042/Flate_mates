
export interface CarouselProps {
  handleClick: (imgUrl: string, index: number) => void
  controls: any
  cards: string[]
  isCarouselActive: boolean
}
