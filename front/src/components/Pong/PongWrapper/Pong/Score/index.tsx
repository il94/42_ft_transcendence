
import PlayerScore from './PlayerScore';

type ScoreProps = {
	LeftScore: number;
	RightScore: number;
	size: number;
  };

function Score({LeftScore, RightScore, size}: ScoreProps){

	return (
		<>
		<PlayerScore Hposition = {30} Score={LeftScore} size={size}/>
		<PlayerScore Hposition = {70} Score={RightScore} size={size}/>
		</>
	);
}

export default Score;