with open(r'D:\projek warasik\frontend\src\components\DualPaneWorkbench.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# Replace top banner
c = c.replace(
    'className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden font-sans"',
    'className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] overflow-hidden font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200"'
)
c = c.replace(
    'className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xs"',
    'className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xs"'
)
c = c.replace(
    'text-xl font-black text-slate-900 mt-1 tracking-tight',
    'text-xl font-black text-slate-900 dark:text-white mt-1 tracking-tight'
)
c = c.replace(
    'text-lg font-black text-slate-800',
    'text-lg font-black text-slate-800 dark:text-slate-100'
)
c = c.replace(
    'className="w-full lg:w-1/2 p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto bg-slate-100/60"',
    'className="w-full lg:w-1/2 p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-slate-100/60 dark:bg-slate-950/40"'
)
c = c.replace(
    'className="w-full lg:w-1/2 p-4 md:p-6 overflow-y-auto flex flex-col justify-between space-y-6"',
    'className="w-full lg:w-1/2 p-4 md:p-6 overflow-y-auto flex flex-col justify-between space-y-6 bg-[#F8FAFC] dark:bg-[#0B0F17]"'
)

# Replace document paper in dark mode
c = c.replace(
    'className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 relative overflow-hidden font-document text-slate-900 leading-normal"',
    'className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700/80 shadow-sm p-6 relative overflow-hidden font-document text-slate-900 dark:text-slate-100 leading-normal"'
)
c = c.replace(
    'className="font-black text-sm uppercase tracking-wide text-slate-900 font-sans"',
    'className="font-black text-sm uppercase tracking-wide text-slate-900 dark:text-white font-sans"'
)
c = c.replace(
    'className="text-[11px] text-slate-500 font-sans"',
    'className="text-[11px] text-slate-500 dark:text-slate-400 font-sans"'
)
c = c.replace(
    'className="border-b border-slate-200 pb-3 mb-4"',
    'className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4"'
)
c = c.replace(
    'className="border-b border-slate-100"',
    'className="border-b border-slate-100 dark:border-slate-800"'
)
c = c.replace(
    'className="flex justify-between py-2 bg-slate-50 px-2.5 rounded-lg font-bold"',
    'className="flex justify-between py-2 bg-slate-50 dark:bg-slate-800/80 px-2.5 rounded-lg font-bold"'
)
c = c.replace(
    'className="mt-4 p-3.5 rounded-xl border-2 border-red-500 bg-red-50/70 relative font-sans"',
    'className="mt-4 p-3.5 rounded-xl border-2 border-red-500 bg-red-50/70 dark:bg-red-950/40 relative font-sans"'
)
c = c.replace(
    'className="text-[10.5px] text-red-700 font-semibold"',
    'className="text-[10.5px] text-red-700 dark:text-red-400 font-semibold"'
)
c = c.replace(
    'className="text-base font-black text-red-900 font-mono"',
    'className="text-base font-black text-red-900 dark:text-red-300 font-mono"'
)
c = c.replace(
    'className="text-[10.5px] text-red-800 mt-2 font-medium leading-relaxed"',
    'className="text-[10.5px] text-red-800 dark:text-red-300 mt-2 font-medium leading-relaxed"'
)

# Right pane tabs and decision gate
c = c.replace(
    'className="p-5 bg-slate-50/90 rounded-2xl border border-slate-300 shadow-xs"',
    'className="p-5 bg-slate-50/90 dark:bg-slate-900/90 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs"'
)
c = c.replace(
    'text-xs font-black text-slate-900 uppercase tracking-wider mb-3',
    'text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3'
)
c = c.replace(
    ': \'bg-white text-slate-700 border-slate-300 hover:border-emerald-600\'',
    ': \'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-600\''
)
c = c.replace(
    ': \'bg-white text-slate-700 border-slate-300 hover:border-amber-600\'',
    ': \'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-600\''
)
c = c.replace(
    ': \'bg-white text-slate-700 border-slate-300 hover:border-red-600\'',
    ': \'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-red-600\''
)
c = c.replace(
    'className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl',
    'className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl'
)
c = c.replace(
    'className="p-3.5 bg-slate-50 rounded-xl border border-slate-200"',
    'className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700"'
)

with open(r'D:\projek warasik\frontend\src\components\DualPaneWorkbench.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated DualPaneWorkbench.tsx for dark mode cleanly')
