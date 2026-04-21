'use client';

import { useState } from 'react';
import { useForm } from '@formspree/react';

const ForOwners = () => {
  const [state, handleFormspreeSubmit] = useForm('xjgjelzp');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    unitType: '',
    unitCount: '',
  });

  const unitTypes = ['شقق', 'فلل', 'محلات', 'مكاتب', 'أخرى'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleFormspreeSubmit(e);
  };

  return (
    <div className="relative overflow-hidden bg-foreground py-16 md:py-24 lg:py-32" id="owners">
      {/* Abstract Art Background */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/3 animate-float-slow rounded-full bg-primary blur-[100px] md:h-[600px] md:w-[600px] md:blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/3 animate-float-reverse rounded-full bg-blue-500 blur-[100px] md:h-[500px] md:w-[500px] md:blur-[150px]"></div>
        <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 opacity-50 blur-[80px] md:h-[300px] md:w-[300px] md:blur-[120px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col items-start gap-16 lg:flex-row lg:gap-24">
          {/* Content */}
          <div className="reveal order-2 hidden text-white lg:sticky lg:top-24 lg:order-1 lg:block lg:w-5/12">
            <div className="mb-6 inline-block rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 shadow-glass backdrop-blur-md md:mb-8 md:text-sm">
              للملاك والمستثمرين 🏢
            </div>
            <h2 className="mb-8 text-3xl font-black leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              عقارك يستحق <br />
              <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-400 bg-clip-text text-transparent">إدارة محترفة.</span>
            </h2>
            <p className="mb-12 max-w-xl text-lg font-light leading-relaxed text-slate-300 md:text-xl">
              تخلص من صداع التأجير التقليدي. دعنا نتولى المهمة ونحول عقارك إلى أصل مدر للدخل بأقل مجهود منك.
            </p>

            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-10">
              {[
                { title: 'حماية للعقار', desc: 'تأمين وصيانة دورية تحفظ قيمة أصلك.', icon: '🛡️' },
                { title: 'عقود مرنة', desc: 'حرية في اختيار فترات التشغيل.', icon: '📄' },
                { title: 'دفعات منتظمة', desc: 'تحويلات مالية شهرية منتظمة.', icon: '💸' },
                { title: 'شفافية تامة', desc: 'لا رسوم خفية، كل شيء واضح.', icon: '🔍' },
              ].map((item, idx) => (
                <div key={idx} className="group flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl shadow-inner transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/20">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white transition-colors group-hover:text-primary">{item.title}</h3>
                    <p className="text-sm font-light leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="reveal delay-200 order-1 w-full lg:order-2 lg:w-7/12">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl md:p-10">
              <div className="relative z-10">
                <div className="mb-8">
                  <h3 className="mb-2 text-2xl font-black tracking-tight text-foreground md:text-3xl">ابدأ شراكتك معنا</h3>
                  <p className="text-sm font-medium text-muted-foreground">املأ البيانات لنقوم بتحليل عقارك وتقديم العرض الأنسب لك.</p>
                </div>

                {state.succeeded ? (
                  <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-green-100 bg-green-50 p-8 py-24 text-center">
                    <div className="mb-6 flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-green-100 text-3xl">🎉</div>
                    <h4 className="mb-2 text-2xl font-black text-green-900">تم استلام طلبك!</h4>
                    <p className="font-medium text-green-700">فريق علاقات الملاك سيتواصل معك قريباً.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                      <div className="group space-y-2">
                        <label className="mr-1 text-xs font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                          الاسم الكريم
                        </label>
                        <input
                          required
                          type="text"
                          name="name"
                          className="w-full rounded-xl border border-border bg-muted px-4 py-3.5 font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                          placeholder="الاسم الثلاثي"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="group space-y-2">
                        <label className="mr-1 text-xs font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                          رقم الجوال
                        </label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          placeholder="05xxxxxxxx"
                          className="w-full rounded-xl border border-border bg-muted px-4 py-3.5 text-left font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                          dir="ltr"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                      <div className="group space-y-2">
                        <label className="mr-1 text-xs font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                          المدينة
                        </label>
                        <input
                          required
                          type="text"
                          name="city"
                          placeholder="مثلاً: الرياض"
                          className="w-full rounded-xl border border-border bg-muted px-4 py-3.5 font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div className="group space-y-2">
                        <label className="mr-1 text-xs font-bold text-muted-foreground transition-colors group-focus-within:text-primary">
                          عدد الوحدات
                        </label>
                        <input
                          required
                          type="number"
                          name="unitCount"
                          min="1"
                          placeholder="مثلاً: 1"
                          className="w-full rounded-xl border border-border bg-muted px-4 py-3.5 font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                          value={formData.unitCount}
                          onChange={(e) => setFormData({ ...formData, unitCount: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Unit Type Selection */}
                    <div className="space-y-3">
                      <label className="mr-1 block text-xs font-bold text-muted-foreground">نوع الوحدات</label>
                      <div className="flex flex-wrap gap-2">
                        {unitTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, unitType: type })}
                            className={`rounded-xl border px-5 py-2.5 text-sm font-bold transition-all duration-300 ${formData.unitType === type
                                ? 'scale-105 border-foreground bg-foreground text-white shadow-lg'
                                : 'border-border bg-muted text-muted-foreground hover:border-border hover:bg-white'
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      <input type="hidden" name="unitType" required value={formData.unitType} />
                    </div>

                    <button
                      type="submit"
                      disabled={state.submitting || !formData.unitType}
                      className="group relative mt-6 w-full overflow-hidden rounded-2xl bg-primary py-4 text-lg font-black text-white shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:bg-muted md:py-5"
                    >
                      {state.submitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white delay-100"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white delay-200"></div>
                        </div>
                      ) : (
                        <>
                          <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></span>
                          <span className="relative z-10">إرسال طلب الانضمام</span>
                        </>
                      )}
                    </button>
                    <p className="mt-2 text-center text-[10px] text-muted-foreground">بإرسال الطلب أنت توافق على سياسة الخصوصية</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForOwners;
