
import React, { useState } from 'react';
import { allQuestions, getQuestionsByVariant, totalVariants } from './data/questions';
import { QuizState } from './types';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  LayoutGrid, 
  Trophy, 
  Zap, 
  ChevronRight, 
  ArrowLeft,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    selectedVariant: null,
    currentQuestionIndex: 0,
    score: 0,
    showResults: false,
    userAnswers: [],
    isStarted: false,
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const selectVariant = (variant: number) => {
    const questions = getQuestionsByVariant(variant);
    setState({
      selectedVariant: variant,
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      userAnswers: Array(questions.length).fill(null),
      isStarted: true,
    });
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const currentQuestions = state.selectedVariant ? getQuestionsByVariant(state.selectedVariant) : [];
  const currentQuestion = currentQuestions[state.currentQuestionIndex];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    if (!currentQuestion) return;
    
    setSelectedOption(idx);
    
    const isCorrect = idx === currentQuestion.correctAnswer;
    setIsAnswered(true);
    
    if (isCorrect) {
      setState(prev => ({ ...prev, score: prev.score + 1 }));
    }

    // Auto-advance after delay
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleNext = () => {
    setState(prev => {
      if (prev.showResults || !prev.isStarted || !prev.selectedVariant) return prev;

      const questions = getQuestionsByVariant(prev.selectedVariant);
      
      if (prev.currentQuestionIndex + 1 < questions.length) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        };
      } else {
        return { ...prev, showResults: true };
      }
    });

    setIsAnswered(false);
    setSelectedOption(null);
  };

  const resetToHome = () => {
    setState({
      selectedVariant: null,
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      userAnswers: [],
      isStarted: false,
    });
  };

  if (!state.isStarted) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 text-center">
            <div className="inline-flex p-3 bg-red-600 rounded-2xl mb-4 shadow-lg shadow-red-200">
              <Trophy className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Nemis Tili Quiz</h1>
            <p className="text-slate-500">1-kurs talabalari uchun yakuniy test (500 ta savol)</p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: totalVariants }, (_, i) => i + 1).map(v => {
              const questionCount = getQuestionsByVariant(v).length;
              return (
              <button
                key={v}
                onClick={() => selectVariant(v)}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-400 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                  <LayoutGrid className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
                </div>
                <h3 className="font-bold text-slate-800">Variant {v}</h3>
                <p className="text-xs text-slate-400 mt-1">{questionCount} ta savol</p>
              </button>
            )})}
          </div>
        </div>
      </div>
    );
  }

  if (state.showResults) {
    const totalQ = currentQuestions.length;
    const percentage = totalQ > 0 ? Math.round((state.score / totalQ) * 100) : 0;
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 text-center">
          <div className="mb-6 inline-block p-4 bg-yellow-50 rounded-full">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Natija Yakunlandi!</h2>
          <p className="text-slate-500 mb-8">Variant {state.selectedVariant} yakuniga yetdi.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-2xl font-bold text-red-600">{state.score}/{totalQ}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">To'g'ri</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-2xl font-bold text-slate-800">{percentage}%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Foiz</p>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => selectVariant(state.selectedVariant!)}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 flex items-center justify-center gap-2 hover:bg-red-700 transition-all"
            >
              <RotateCcw className="w-5 h-5" /> Qayta urinish
            </button>
            <button 
              onClick={resetToHome}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> Bosh sahifa
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="text-slate-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={resetToHome} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="text-center">
            <h2 className="font-bold text-slate-900">Variant {state.selectedVariant}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Savol {state.currentQuestionIndex + 1}/{currentQuestions.length}</p>
          </div>
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-red-600" />
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-500 ease-out" 
              style={{ width: `${((state.currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-3 mb-6">
              <div className="mt-1">
                <MessageCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const labels = ['A', 'B', 'C', 'D'];
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;
                
                let btnStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-900";
                let icon = null;

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-green-50 border-green-200 ring-1 ring-green-500 text-green-700 shadow-sm";
                    icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
                  } else if (isSelected) {
                    btnStyle = "bg-red-50 border-red-200 ring-1 ring-red-500 text-red-700";
                    icon = <XCircle className="w-5 h-5 text-red-600" />;
                  }
                } else if (isSelected) {
                  btnStyle = "bg-red-50 border-red-200 ring-1 ring-red-500 text-red-700";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left group ${btnStyle}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                        isSelected ? 'bg-red-600 text-white' : 
                        isAnswered && isCorrect ? 'bg-green-600 text-white' : 
                        isAnswered && isSelected ? 'bg-red-600 text-white' : 
                        'bg-white text-green-700 border border-green-200'
                      }`}>
                        {labels[idx]}
                      </span>
                      <span className="font-medium text-sm md:text-base">{option}</span>
                    </div>
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-slate-600">Jami To'g'ri: {state.score}</span>
            </div>
          </div>
        </div>
      </main>

      {isAnswered && (
        <div className="bg-white border-t border-slate-200 p-4 animate-in slide-in-from-bottom-full duration-300">
           <div className="max-w-2xl mx-auto flex justify-between items-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Javob berildi</p>
             <button 
              onClick={handleNext}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm"
             >
               Keyingisi <ChevronRight className="w-4 h-4" />
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
