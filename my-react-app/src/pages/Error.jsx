import FuzzyText from "../components/FuzzyText";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <FuzzyText
        baseIntensity={0.1}
        hoverIntensity={0.2}
        enableHover={true}
        >
        404
        </FuzzyText>
        <FuzzyText
        fontSize="4rem"
        baseIntensity={0.1}
        hoverIntensity={0.2}
        enableHover={true}
        >
        
            Ошибка!
        </FuzzyText>
        
    </div>
    
  );
}