'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Theme = 'color' | 'brutalist';

const TiltImage = ({ src, alt, glowColor, accentColor, theme }: { src: string, alt: string, glowColor: string, accentColor: string, theme: Theme }) => {
  const [transform, setTransform] = useState('perspective(1200px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = -(e.clientY - top - height / 2) / 20;
    setTransform(`perspective(1200px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const isColor = theme === 'color';

  return (
    <div className="py-16 flex justify-center w-full">
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full relative group cursor-crosshair"
        style={{ perspective: '1200px' }}
      >
        <div 
          className="relative w-full ease-out"
          style={{ 
            transform, 
            transformStyle: 'preserve-3d',
            transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' 
          }}
        >
          {isColor ? (
            <div 
              className={`absolute inset-0 bg-gradient-to-r ${glowColor} rounded-3xl opacity-20 group-hover:opacity-40 blur-3xl transition-opacity duration-500`}
              style={{ transform: 'translateZ(-50px)' }}
            />
          ) : (
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                transform: 'translateZ(-40px) translate(20px, 20px)',
                backgroundColor: accentColor
              }}
            />
          )}
          
          <div 
            className={`absolute ${isColor ? 'inset-8 border-white/10 rounded-3xl' : 'inset-4 border-zinc-700 rounded-xl bg-zinc-900/50 backdrop-blur-md'} border pointer-events-none`}
            style={{ transform: 'translateZ(-30px)' }}
          />
          
          <img 
            src={src} 
            alt={alt} 
            className={`relative w-full h-auto z-10 pointer-events-none ${isColor ? 'rounded-3xl shadow-2xl border-2 border-white/10' : 'rounded-xl border border-zinc-800 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'}`}
            style={{ transform: 'translateZ(20px)' }}
          />
          
          <div 
            className={`absolute pointer-events-none transition-colors duration-500 z-20 ${isColor ? '-inset-6 border-2 border-white/20 rounded-[2.5rem] group-hover:border-white/40' : '-inset-4 border-2 border-zinc-100/10 rounded-[1.5rem] group-hover:border-zinc-100/30 mix-blend-overlay'}`}
            style={{ transform: 'translateZ(60px)' }}
          />
        </div>
      </div>
    </div>
  );
};

const Paragraph = ({ children, theme }: { children: React.ReactNode, theme: Theme }) => (
  <p className={`text-xl font-medium hover:text-white transition-colors duration-200 ${theme === 'color' ? 'text-[#e2e8f0] leading-[1.85]' : 'text-zinc-300 leading-[1.8] tracking-[-0.01em]'}`}>
    {children}
  </p>
);

const CodeBlock = ({ children, isError = false, theme }: { children: React.ReactNode, isError?: boolean, theme: Theme }) => {
  if (theme === 'color') {
    return (
      <div className={`relative group rounded-2xl overflow-hidden my-8 ${isError ? 'bg-red-500/10' : 'bg-[#1e1e2e]'}`}>
        <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <pre className={`p-6 overflow-x-auto ${isError ? 'text-red-400' : 'text-[#a6accd]'} text-lg font-mono font-bold leading-relaxed group-hover:scale-[1.01] transition-transform duration-300`}>
          <code>{children}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={`relative group rounded-xl overflow-hidden my-10 border ${isError ? 'border-red-500/50' : 'border-zinc-800'}`}>
      <div className={`px-4 py-2 border-b font-mono text-[10px] tracking-widest uppercase font-bold ${isError ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
        {isError ? 'Exception / Crash Log' : 'Source / Output'}
      </div>
      <pre className={`p-6 overflow-x-auto ${isError ? 'bg-red-950/20 text-red-400' : 'bg-[#0f0f11] text-zinc-300'} text-lg font-mono font-bold leading-relaxed group-hover:scale-[1.01] transition-transform duration-300`}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

const InlineCode = ({ children, theme }: { children: React.ReactNode, theme: Theme }) => (
  <code className={`px-2 rounded font-mono font-bold ${theme === 'color' ? 'bg-[#2a2a35] text-[#89ddff] py-1 text-lg hover:bg-[#343442] hover:text-[#82aaff] transition-all cursor-pointer' : 'bg-zinc-800 text-zinc-100 py-0.5 text-lg border border-zinc-700/50 shadow-sm'}`}>
    {children}
  </code>
);

const SubHeading = ({ children, theme }: { children: React.ReactNode, theme: Theme }) => (
  <h2 className={`text-3xl md:text-4xl font-extrabold mt-20 md:mt-24 mb-10 tracking-tight transform hover:translate-x-2 transition-transform duration-300 cursor-default ${theme === 'color' ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-500' : 'text-white'}`}>
    {children}
  </h2>
);

const FunDivider = ({ theme }: { theme: Theme }) => {
  if (theme === 'color') {
    return (
      <div className="w-full flex justify-center py-16 gap-4">
        <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center py-20 gap-3">
      <div className="w-8 h-2 bg-zinc-800 hover:bg-zinc-500 transition-colors cursor-crosshair skew-x-12"></div>
      <div className="w-8 h-2 bg-zinc-800 hover:bg-zinc-500 transition-colors cursor-crosshair skew-x-12"></div>
      <div className="w-8 h-2 bg-zinc-800 hover:bg-zinc-500 transition-colors cursor-crosshair skew-x-12"></div>
    </div>
  );
};

export default function ArticlePage() {
  const [theme, setTheme] = useState<Theme>('brutalist');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-screen w-full bg-[#0f111a]" />; // Prevent hydration mismatch

  const isColor = theme === 'color';

  return (
    <div className={`h-screen w-full overflow-y-auto relative transition-colors duration-500 ${isColor ? 'bg-[#0f111a] selection:bg-pink-500' : 'bg-[#09090b] selection:bg-[#ccff00] selection:text-black'} text-white`}>
      
      {/* Backgrounds */}
      {isColor ? (
        <>
          <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-600/20 blur-[150px] pointer-events-none mix-blend-screen" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/20 blur-[150px] pointer-events-none mix-blend-screen" />
          <div className="fixed top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none mix-blend-screen" />
        </>
      ) : (
        <div 
          className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
      )}

      {/* Nav */}
      <nav className={`fixed top-0 w-full px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-xl z-50 border-b transition-colors duration-500 ${isColor ? 'bg-[#0f111a]/70 border-white/10' : 'bg-[#09090b]/80 border-white/5'}`}>
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-between items-center">
          <Link href="/" className={`px-4 py-2 rounded-md hover:scale-105 active:scale-95 transition-all font-bold text-sm flex items-center gap-2 ${isColor ? 'bg-white/5 hover:bg-white/10 text-white rounded-full' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
            <span>←</span> <span className="hidden sm:inline">Back to 3D Room</span><span className="sm:hidden">Back</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <div className="flex bg-black/40 p-1 rounded-full border border-white/10 text-xs font-bold">
              <button 
                onClick={() => setTheme('color')}
                className={`px-3 py-1.5 rounded-full transition-all ${isColor ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:text-white/80'}`}
              >
                Color
              </button>
              <button 
                onClick={() => setTheme('brutalist')}
                className={`px-3 py-1.5 rounded-full transition-all ${!isColor ? 'bg-[#ccff00] text-black shadow-lg' : 'text-white/40 hover:text-white/80'}`}
              >
                Brutalist
              </button>
            </div>

            <div className={`hidden md:block px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase ${isColor ? 'rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30 text-pink-300' : 'bg-[#ccff00] text-black shadow-[4px_4px_0_rgba(255,255,255,0.1)]'}`}>
              Ep 1
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-36 sm:pt-40 pb-32 px-6 sm:px-12 xl:px-0 relative z-10 font-sans">
        <article className="space-y-10">
          
          <header className="space-y-8 sm:space-y-10 mb-20 md:mb-24 text-center">
            {isColor ? (
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  A search bar
                </span>
                taught me something AI never mentioned.
              </h1>
            ) : (
              <h1 className="text-5xl md:text-[5rem] font-black tracking-tighter text-white leading-[1.05] hover:scale-[1.02] transition-transform duration-300">
                A search bar taught me something <span className="bg-[#ccff00] text-black px-2 mx-1 inline-block transform -rotate-1">AI never mentioned.</span>
              </h1>
            )}
            
            <p className={`text-xl md:text-2xl font-medium tracking-wide ${isColor ? 'text-blue-200/60' : 'text-zinc-500 tracking-tight'}`}>
              Sometimes the best lessons come from breaking things.
            </p>
          </header>

          <Paragraph theme={theme}>
            A couple of days ago I was working on a completely unrelated feature in Doordripp.
          </Paragraph>
          <Paragraph theme={theme}>
            Nothing related to search.
          </Paragraph>
          <Paragraph theme={theme}>
            The feature happened to use the search endpoint, so I opened the page and searched for a random product.
          </Paragraph>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className={`${isColor ? 'bg-white/5 p-6 rounded-3xl border border-white/10' : 'bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:-translate-y-1'} flex items-center gap-4 transition-all cursor-default ${isColor && 'hover:bg-white/10 hover:-translate-y-2'}`}>
              <div className={`flex items-center justify-center font-black ${isColor ? 'w-12 h-12 rounded-2xl bg-green-500/20 text-green-400 text-2xl' : 'w-8 h-8 bg-zinc-100 text-black text-xl rounded-sm shadow-[4px_4px_0_#ccff00]'}`}>✓</div>
              <div className={`text-xl font-bold text-white ${!isColor && 'tracking-tight'}`}>Worked.</div>
            </div>
            <div className={`${isColor ? 'bg-white/5 p-6 rounded-3xl border border-white/10' : 'bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:-translate-y-1'} flex items-center gap-4 transition-all cursor-default ${isColor && 'hover:bg-white/10 hover:-translate-y-2'}`}>
              <div className={`flex items-center justify-center font-black ${isColor ? 'w-12 h-12 rounded-2xl bg-green-500/20 text-green-400 text-2xl' : 'w-8 h-8 bg-zinc-100 text-black text-xl rounded-sm shadow-[4px_4px_0_#ccff00]'}`}>✓</div>
              <div className={`text-xl font-bold text-white ${!isColor && 'tracking-tight'}`}>Then another one. Worked.</div>
            </div>
          </div>

          <Paragraph theme={theme}>
            Out of pure laziness, instead of typing another word, I just smashed the keyboard.
          </Paragraph>

          <CodeBlock theme={theme}>
            ((((((((((((
          </CodeBlock>

          <Paragraph theme={theme}>
            Enter.
          </Paragraph>
          
          <p className={`text-4xl font-black my-8 transform hover:scale-110 transition-transform cursor-default inline-block ${isColor ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500' : 'text-[#ff3366] tracking-tighter uppercase'}`}>
            {isColor ? 'Boom. 💥' : 'Boom.'}
          </p>

          <CodeBlock isError theme={theme}>
            500 Internal Server Error
          </CodeBlock>

          <TiltImage 
            theme={theme}
            src="/asset/Screenshot 2026-07-03.png" 
            alt="Search error illustration" 
            glowColor="from-red-500 to-pink-500" 
            accentColor="#ff3366" 
          />

          <Paragraph theme={theme}>
            My first reaction wasn't "Oh, this is a security issue."
          </Paragraph>
          <Paragraph theme={theme}>
            It was,
          </Paragraph>
          
          <blockquote className={`italic block transform transition-all duration-300 py-6 px-8 my-12 ${isColor ? 'text-3xl md:text-4xl text-white font-extrabold leading-tight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-l-8 border-cyan-500 rounded-r-3xl hover:translate-x-4' : 'text-3xl md:text-4xl text-white font-black leading-tight bg-zinc-900 border-l-[12px] border-[#ccff00] hover:translate-x-4 shadow-xl'}`}>
            "Wait... why would twelve brackets crash the backend?"
          </blockquote>
          
          <Paragraph theme={theme}>I searched again.</Paragraph>
          
          <div className="flex flex-wrap gap-4 my-8">
            <div className={`px-6 py-3 font-mono text-xl font-bold text-white flex items-center gap-3 ${isColor ? 'bg-[#1e1e2e] rounded-xl border border-white/10' : 'bg-zinc-900 border border-zinc-800'}`}>
              shirt <span className={isColor ? 'text-green-400' : 'text-[#ccff00]'}>✓</span>
            </div>
            <div className={`px-6 py-3 font-mono text-xl font-bold text-white flex items-center gap-3 ${isColor ? 'bg-[#1e1e2e] rounded-xl border border-white/10' : 'bg-zinc-900 border border-zinc-800'}`}>
              iphone <span className={isColor ? 'text-green-400' : 'text-[#ccff00]'}>✓</span>
            </div>
            <div className={`px-6 py-3 font-mono text-xl font-bold text-white flex items-center gap-3 ${isColor ? 'bg-[#1e1e2e] rounded-xl border border-white/10' : 'bg-zinc-900 border border-zinc-800'}`}>
              milk <span className={isColor ? 'text-green-400' : 'text-[#ccff00]'}>✓</span>
            </div>
          </div>

          <CodeBlock theme={theme}>((((((((((((</CodeBlock>
          <Paragraph theme={theme}>500 again. 💀</Paragraph>
          
          <Paragraph theme={theme}>
            At this point I knew it wasn't random.
          </Paragraph>
          <Paragraph theme={theme}>
            Something about those brackets was making the backend angry.
          </Paragraph>

          <FunDivider theme={theme} />

          <SubHeading theme={theme}>Digging into the backend</SubHeading>

          <Paragraph theme={theme}>
            The search implementation was fairly simple.
          </Paragraph>

          <CodeBlock theme={theme}>
{`const regex = new RegExp(search, "i");

const products = await Product.find({
    name: regex
});`}
          </CodeBlock>

          <Paragraph theme={theme}>
            Nothing fancy.
          </Paragraph>
          <Paragraph theme={theme}>
            In fact, if you've built search using MongoDB before, you've probably written something similar.
          </Paragraph>
          <Paragraph theme={theme}>
            And yes... AI helped generate most of it. {isColor && '🤖'}
          </Paragraph>
          <Paragraph theme={theme}>
            It looked reasonable. It worked during testing. Nobody questioned it.
          </Paragraph>
          <Paragraph theme={theme}>
            Including me.
          </Paragraph>

          {/* Tangent Block */}
          {isColor ? (
            <div className="my-16 p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-cyan-500/10 border-2 border-white/10 relative hover:border-white/20 transition-colors duration-500 group">
              <span className="absolute -top-8 -left-4 text-7xl opacity-50 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">💭</span>
              <div className="space-y-6">
                <Paragraph theme={theme}>
                  It's funny writing this during the whole "AI slop" phase the industry seems to be going through.
                </Paragraph>
                <Paragraph theme={theme}>
                  Suddenly everyone can tell whether something was written by AI.
                </Paragraph>
                <div className="flex flex-wrap gap-3 my-4">
                  <span className="px-4 py-2 rounded-xl bg-white/5 font-mono text-sm text-green-400 border border-green-500/20">ChatGPT has a style.</span>
                  <span className="px-4 py-2 rounded-xl bg-white/5 font-mono text-sm text-orange-400 border border-orange-500/20">Claude has a style.</span>
                  <span className="px-4 py-2 rounded-xl bg-white/5 font-mono text-sm text-blue-400 border border-blue-500/20">Gemini has a style.</span>
                </div>
                <Paragraph theme={theme}>
                  At this point I feel like people are reviewing prose harder than production code.
                </Paragraph>
                <Paragraph theme={theme}>
                  Ironically, nobody looked at my search endpoint and said,
                </Paragraph>
                
                <blockquote className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 italic block transform hover:scale-105 hover:translate-x-4 transition-all duration-300 py-2">
                  "Hmm... this regex looks suspicious."
                </blockquote>
                
                <Paragraph theme={theme}>
                  Anyway... Let's get back to the bug. 🐛
                </Paragraph>
              </div>
            </div>
          ) : (
            <div className="my-16 p-8 md:p-10 bg-[#e2e2e2] text-black border-4 border-black relative hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0_#ccff00]">
              <div className="space-y-6">
                <p className="text-2xl font-black tracking-tight leading-snug">
                  It's funny writing this during the whole "AI slop" phase the industry seems to be going through.
                </p>
                <p className="text-xl font-bold text-zinc-700">
                  Suddenly everyone can tell whether something was written by AI.
                </p>
                <div className="flex flex-wrap gap-3 my-4">
                  <span className="px-4 py-2 bg-black text-white font-mono text-sm font-bold shadow-[2px_2px_0_#ccff00]">ChatGPT has a style.</span>
                  <span className="px-4 py-2 bg-black text-white font-mono text-sm font-bold shadow-[2px_2px_0_#ccff00]">Claude has a style.</span>
                  <span className="px-4 py-2 bg-black text-white font-mono text-sm font-bold shadow-[2px_2px_0_#ccff00]">Gemini has a style.</span>
                </div>
                <p className="text-xl font-bold text-zinc-700">
                  At this point I feel like people are reviewing prose harder than production code.
                </p>
                <p className="text-xl font-bold text-zinc-700">
                  Ironically, nobody looked at my search endpoint and said,
                </p>
                
                <blockquote className="text-2xl md:text-3xl font-black text-black italic block bg-[#ccff00] p-4 inline-block transform -rotate-1 border-2 border-black">
                  "Hmm... this regex looks suspicious."
                </blockquote>
                
                <p className="text-xl font-bold text-black pt-4">
                  Anyway... Let's get back to the bug. 🐛
                </p>
              </div>
            </div>
          )}

          <FunDivider theme={theme} />

          <SubHeading theme={theme}>Why did one search crash everything?</SubHeading>

          <Paragraph theme={theme}>
            Because those brackets weren't being treated as text.
          </Paragraph>
          <Paragraph theme={theme}>
            They were being treated as <strong className={isColor ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-2xl mx-1 font-black' : 'text-white bg-[#ff3366] px-2 py-0.5 mx-1 font-black uppercase tracking-widest'}>regular expression syntax</strong>.
          </Paragraph>
          <Paragraph theme={theme}>
            That's an important difference.
          </Paragraph>
          
          <div className={`space-y-6 my-10 p-8 ${isColor ? 'bg-white/5 rounded-3xl border border-white/10' : 'bg-zinc-900 border-l-4 border-zinc-700'}`}>
            <Paragraph theme={theme}>
              When you search <InlineCode theme={theme}>shirt</InlineCode>, JavaScript builds something like <InlineCode theme={theme}>/shirt/i</InlineCode>. Perfectly valid.
            </Paragraph>
            <Paragraph theme={theme}>
              When you search <InlineCode theme={theme}>iphone</InlineCode>, it becomes <InlineCode theme={theme}>/iphone/i</InlineCode>. Still fine.
            </Paragraph>
            <Paragraph theme={theme}>
              But when you search <InlineCode theme={theme}>((((((((((((</InlineCode>, JavaScript tries to build <InlineCode theme={theme}>/((((((((((((/i</InlineCode> which isn't valid regex anymore.
            </Paragraph>
          </div>

          <Paragraph theme={theme}>
            Those opening parentheses represent capture groups. There are twelve opening groups. Zero closing groups.
          </Paragraph>

          <Paragraph theme={theme}>The regex compiler immediately throws a fit:</Paragraph>

          <CodeBlock isError theme={theme}>
{`SyntaxError:
Invalid regular expression:
/((((((((((((/i:
Unterminated group`}
          </CodeBlock>

          <Paragraph theme={theme}>
            MongoDB never even receives the query. The request dies before that.
          </Paragraph>
          <Paragraph theme={theme}>
            Hence...
          </Paragraph>

          <CodeBlock isError theme={theme}>500 Internal Server Error</CodeBlock>

          <FunDivider theme={theme} />

          <SubHeading theme={theme}>I thought that was the bug.</SubHeading>

          <Paragraph theme={theme}>
            It wasn't.
          </Paragraph>
          <Paragraph theme={theme}>
            While reading about unsafe regex handling I kept coming across another term.
          </Paragraph>

          <div className={`text-center transform transition-transform duration-300 ${isColor ? 'my-16 hover:scale-110' : 'my-24 hover:scale-105'}`}>
            <span className={`font-black ${isColor ? 'text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]' : 'text-7xl md:text-[8rem] text-white tracking-tighter uppercase inline-block border-y-8 border-[#ccff00] py-4'}`}>
              ReDoS
            </span>
          </div>

          <Paragraph theme={theme}>
            <strong>Regular Expression Denial of Service.</strong>
          </Paragraph>

          <Paragraph theme={theme}>
            I had genuinely never heard of it before. At first I assumed it was the same thing. It isn't. The brackets I entered simply created an invalid regex.
          </Paragraph>
          <Paragraph theme={theme}>
            A ReDoS attack is much nastier.
          </Paragraph>

          <TiltImage 
            theme={theme}
            src="/asset/Screenshot 2026-07-06 024852.png" 
            alt="ReDoS illustration" 
            glowColor="from-purple-500 to-cyan-500" 
            accentColor="#ccff00" 
          />

          <FunDivider theme={theme} />

          <SubHeading theme={theme}>So what actually is ReDoS?</SubHeading>

          <Paragraph theme={theme}>
            Imagine your backend allows users to type anything into search. Whatever they type becomes a regex.
          </Paragraph>
          <Paragraph theme={theme}>
            Now suppose someone intentionally supplies a regex that is perfectly valid. No syntax errors. No exceptions.
          </Paragraph>
          <Paragraph theme={theme}>
            Just... <span className={`font-black mx-1 ${isColor ? 'text-3xl text-pink-400' : 'text-2xl text-white bg-black border border-white px-2 py-0.5'}`}>extremely expensive</span> to evaluate.
          </Paragraph>
          
          <Paragraph theme={theme}>One famous example looks like this.</Paragraph>
          <CodeBlock theme={theme}>(a+)+$</CodeBlock>

          <Paragraph theme={theme}>
            Looks harmless. It's only a few characters. Now imagine matching it against:
          </Paragraph>
          <CodeBlock theme={theme}>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaX</CodeBlock>

          <Paragraph theme={theme}>
            Notice the final <strong className={`font-black mx-1 inline-block ${isColor ? 'text-red-500 text-3xl animate-pulse' : 'text-white text-3xl bg-red-600 px-2 py-1 -rotate-3'}`}>X</strong>.
          </Paragraph>
          <Paragraph theme={theme}>
            The regex engine now has to explore an enormous number of possible ways to match the string before finally deciding, "Nope."
          </Paragraph>
          
          {isColor ? (
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-3xl p-8 my-12 transform hover:-translate-y-2 transition-transform">
              <Paragraph theme={theme}>
                This process is called <strong className="text-red-400 font-black text-2xl">catastrophic backtracking</strong>.
              </Paragraph>
              <Paragraph theme={theme}>
                The regex engine keeps trying different combinations over and over again. CPU usage spikes. One request takes far longer than it should.
              </Paragraph>
            </div>
          ) : (
            <div className="bg-red-500 text-white p-8 my-12 transform hover:-translate-y-1 transition-transform border-4 border-red-700 shadow-[8px_8px_0_#3f0000]">
              <p className="text-xl font-bold leading-relaxed mb-4">
                This process is called <strong className="font-black text-3xl block uppercase tracking-tighter">catastrophic backtracking</strong>.
              </p>
              <p className="text-xl font-medium leading-relaxed">
                The regex engine keeps trying different combinations over and over again. CPU usage spikes. One request takes far longer than it should.
              </p>
            </div>
          )}
          
          <Paragraph theme={theme}>
            Multiply that by hundreds of requests.
          </Paragraph>
          <Paragraph theme={theme}>
            Congratulations. Someone is now consuming your server resources without sending huge amounts of traffic.
          </Paragraph>
          <Paragraph theme={theme}>
            That's why it's called <strong className={`font-bold ${isColor ? 'text-white' : 'text-white border-b-4 border-[#ccff00]'}`}>Regular Expression Denial of Service</strong>.
          </Paragraph>
          <Paragraph theme={theme}>
            The server isn't flooded. The regex engine is.
          </Paragraph>

          <FunDivider theme={theme} />

          <SubHeading theme={theme}>"But I'm only using search..."</SubHeading>

          <Paragraph theme={theme}>
            That's exactly what I thought. Search feels harmless. It's just text.
          </Paragraph>
          <Paragraph theme={theme}>
            The problem isn't search. The problem is treating user input as executable regex syntax.
          </Paragraph>
          <Paragraph theme={theme}>
            If users are allowed to control the regex itself, you're no longer searching text. You're executing instructions written by someone else. 📝
          </Paragraph>

          <FunDivider theme={theme} />

          <SubHeading theme={theme}>The fix 🛠️</SubHeading>

          <Paragraph theme={theme}>
            Fortunately the fix wasn't complicated. Instead of building regex directly from user input:
          </Paragraph>
          
          <CodeBlock theme={theme}>new RegExp(search, "i")</CodeBlock>

          <Paragraph theme={theme}>
            I escaped every regex metacharacter first. Characters like:
          </Paragraph>
          
          <div className={`flex flex-wrap gap-3 my-8 ${isColor ? 'bg-white/5 p-6 rounded-3xl border border-white/10' : ''}`}>
            {['.', '*', '+', '?', '^', '$', '(', ')', '[', ']', '{', '}', '|', '\\'].map((char) => (
              <span key={char} className={`flex items-center justify-center font-mono font-black transition-all cursor-default ${isColor ? 'w-12 h-12 bg-[#1e1e2e] text-cyan-400 text-2xl rounded-xl hover:-translate-y-2 hover:bg-cyan-500 hover:text-white' : 'w-12 h-12 bg-zinc-900 border-2 border-zinc-800 text-zinc-100 text-2xl hover:-translate-y-1 hover:bg-zinc-100 hover:text-black'}`}>
                {char}
              </span>
            ))}
          </div>

          <Paragraph theme={theme}>
            lost their special meaning.
          </Paragraph>
          <Paragraph theme={theme}>
            Searching <InlineCode theme={theme}>C++</InlineCode> now literally searches for <InlineCode theme={theme}>C++</InlineCode> instead of interpreting <InlineCode theme={theme}>+</InlineCode> as a regex operator.
          </Paragraph>
          <Paragraph theme={theme}>
            Searching <InlineCode theme={theme}>((((((((((((</InlineCode> simply searches for brackets.
          </Paragraph>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-center">
            {isColor ? (
              <>
                <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-3xl hover:scale-105 transition-transform">
                  <span className="block text-4xl mb-4">🛡️</span>
                  <span className="font-bold text-xl text-white">No exception.</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-3xl hover:scale-105 transition-transform">
                  <span className="block text-4xl mb-4">🚀</span>
                  <span className="font-bold text-xl text-white">No crash.</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-3xl hover:scale-105 transition-transform">
                  <span className="block text-4xl mb-4">✨</span>
                  <span className="font-bold text-xl text-white">No unexpected behavior.</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-zinc-900 border border-zinc-800 p-8 hover:-translate-y-2 transition-transform shadow-[0_8px_0_#18181b]">
                  <span className="block text-4xl mb-4">🛡️</span>
                  <span className="font-black tracking-tight text-xl text-white uppercase">No exception.</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-8 hover:-translate-y-2 transition-transform shadow-[0_8px_0_#18181b]">
                  <span className="block text-4xl mb-4">🚀</span>
                  <span className="font-black tracking-tight text-xl text-white uppercase">No crash.</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-8 hover:-translate-y-2 transition-transform shadow-[0_8px_0_#18181b]">
                  <span className="block text-4xl mb-4">✨</span>
                  <span className="font-black tracking-tight text-xl text-white uppercase">No weirdness.</span>
                </div>
              </>
            )}
          </div>

          <Paragraph theme={theme}>
            After that I extracted the escaping logic into a shared utility and replaced every search endpoint that accepted user-controlled regex.
          </Paragraph>
          <Paragraph theme={theme}>
            It wasn't a difficult fix. Finding it was the difficult part.
          </Paragraph>

          <FunDivider theme={theme} />

          <SubHeading theme={theme}>The bigger lesson 🧠</SubHeading>

          <Paragraph theme={theme}>
            This wasn't AI's fault.
          </Paragraph>
          <Paragraph theme={theme}>
            The generated code wasn't malicious. It wasn't even "bad." It solved exactly the problem I asked it to solve.
          </Paragraph>
          
          <div className={`inline-block my-8 transform transition-transform cursor-default ${isColor ? 'px-8 py-6 bg-white/10 rounded-full hover:rotate-2 border border-white/20' : 'p-6 bg-[#ccff00] text-black hover:-rotate-2 shadow-[8px_8px_0_#ffffff]'}`}>
            <span className={`font-black ${isColor ? 'text-2xl text-white' : 'text-2xl uppercase tracking-tighter'}`}>"Build me a search feature."</span>
          </div>
          
          <Paragraph theme={theme}>
            It did.
          </Paragraph>
          <Paragraph theme={theme}>
            What it didn't solve was everything I never asked about:
          </Paragraph>
          
          <div className="flex flex-wrap gap-4 my-8">
            {['Security 🔒', 'Malformed input 👾', 'Production abuse 🔥', 'Edge cases 🎯'].map((item, i) => (
              <span key={i} className={`font-bold cursor-default transition-all ${isColor ? 'px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]' : 'px-6 py-3 bg-zinc-900 text-white font-black uppercase tracking-tight text-lg border border-zinc-700 hover:bg-white hover:text-black hover:border-white shadow-[4px_4px_0_#27272a]'}`}>
                {item}
              </span>
            ))}
          </div>

          <Paragraph theme={theme}>
            And honestly... Neither did I.
          </Paragraph>
          <Paragraph theme={theme}>
            I reviewed the code. Tested it. Merged it. Because every normal search worked.
          </Paragraph>
          <Paragraph theme={theme}>
            <strong className={`text-white ${isColor ? 'text-2xl' : 'text-3xl font-black bg-black inline-block px-4 py-2 border-l-8 border-[#ff3366]'}`}>AI didn't hide the bug. My testing did.</strong>
          </Paragraph>

          <FunDivider theme={theme} />

          <SubHeading theme={theme}>What changed afterwards?</SubHeading>

          <Paragraph theme={theme}>
            I still use AI almost every day. Probably more than I should.
          </Paragraph>
          <Paragraph theme={theme}>
            The difference is what happens after the code is generated. Now my checklist looks something like this:
          </Paragraph>

          <div className="space-y-4 my-12">
            {[
              "What happens if the input is empty?",
              "What happens if it's 10 MB long?",
              "What happens if someone pastes complete nonsense?",
              "Can this input become code?",
              "Can this input become SQL?",
              "Can this input become regex?",
              "Can this input make my server work harder than it should?"
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-6 p-4 transition-colors group cursor-default ${isColor ? 'rounded-2xl hover:bg-white/5' : 'border-b border-zinc-800 hover:bg-zinc-900'}`}>
                <div className={`font-black flex items-center justify-center shrink-0 transition-colors ${isColor ? 'w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white' : 'w-12 h-12 bg-zinc-800 text-zinc-400 group-hover:bg-[#ccff00] group-hover:text-black rounded-none'}`}>
                  {isColor ? i + 1 : `0${i + 1}`}
                </div>
                <span className={`text-xl transition-colors ${isColor ? 'font-medium text-[#e2e8f0] group-hover:text-white' : 'font-bold text-zinc-300 group-hover:text-white'}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <Paragraph theme={theme}>
            Sometimes the bugs that teach you the most are the ones you find completely by accident.
          </Paragraph>

          <div className="pt-20 pb-16 text-center mt-20">
            {isColor ? (
              <div className="inline-block px-12 py-6 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-[3px] hover:scale-105 transition-transform cursor-pointer shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:shadow-[0_0_60px_rgba(236,72,153,0.6)]">
                <div className="bg-[#0f111a] rounded-full px-10 py-4 h-full w-full flex items-center justify-center">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                    See you in Episode 2 ✌️
                  </span>
                </div>
              </div>
            ) : (
              <div className="inline-block px-12 py-8 bg-zinc-100 text-black border-4 border-black hover:-translate-y-2 hover:shadow-[16px_16px_0_#ccff00] transition-all cursor-pointer">
                <span className="text-4xl font-black uppercase tracking-tighter">
                  See you in Episode 2 ✌️
                </span>
              </div>
            )}
          </div>

        </article>
      </div>
    </div>
  );
}
