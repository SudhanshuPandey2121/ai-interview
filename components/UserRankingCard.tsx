import { TrendingUp, Users, Target } from "lucide-react";

interface UserRankingCardProps {
  ranking: UserRanking;
}

const UserRankingCard = ({ ranking }: UserRankingCardProps) => {
  const getPerformanceMessage = () => {
    if (ranking.outperformed === 0) {
      return "Keep practicing to improve your ranking!";
    } else if (ranking.outperformed === 1) {
      return "You outperformed 1 other participant!";
    } else {
      return `You outperformed ${ranking.outperformed} other participants!`;
    }
  };

  const getPerformanceColor = () => {
    if (ranking.percentile >= 90) return "text-green-600";
    if (ranking.percentile >= 70) return "text-blue-600";
    if (ranking.percentile >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
        <Target className="h-5 w-5" />
        Your Performance
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rank */}
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">#{ranking.rank}</p>
          <p className="text-sm text-gray-600">Your Rank</p>
        </div>
        
        {/* Outperformed */}
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{ranking.outperformed}</p>
          <p className="text-sm text-gray-600">Outperformed</p>
        </div>
        
        {/* Percentile */}
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-purple-500" />
          </div>
          <p className={`text-2xl font-bold ${getPerformanceColor()}`}>
            {ranking.percentile}%
          </p>
          <p className="text-sm text-gray-600">Percentile</p>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-white rounded-lg border">
        <p className="text-center text-gray-700 font-medium">
          {getPerformanceMessage()}
        </p>
        <p className="text-center text-sm text-gray-500 mt-1">
          Out of {ranking.totalParticipants} total participants
        </p>
      </div>
    </div>
  );
};

export default UserRankingCard;