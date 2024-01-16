
import PlayerScore from './PlayerScore';

type ScoreProps = {
	LeftScore: number;
	RightScore: number;
  };

function Score({LeftScore, RightScore}: ScoreProps){

	return (
		<>
		<PlayerScore Hposition = {30} Score={LeftScore}/>
		<PlayerScore Hposition = {70} Score={RightScore}/>
		</>
	);
}

export default Score;