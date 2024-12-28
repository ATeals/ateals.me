import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const TimeIcon = ({ time }: { time: number }) => {
  const icons = ['🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕘'];
  const index = Math.min(Math.floor(time / 5), icons.length - 1);
  return <span className="text-sm">{icons[index]}</span>;
};

export function ReadingTime({ time }: { time: number }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <span className="text-base font-light">
            {time} <TimeIcon time={time} />
          </span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="text-sm">
        <span>
          분당 300자 읽는 독자 기준으로 <strong className="font-normal">{time}분</strong> 소요됩니다.
        </span>
      </HoverCardContent>
    </HoverCard>
  );
}
