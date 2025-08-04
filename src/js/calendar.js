class Calendar {
    constructor(element, language = 'pt') {
        this.element = element;
        this.language = language;
        this.currentDate = new Date();
        this.isYearView = false;
        this.render();
    }

    render() {
        if (this.isYearView) {
            this.renderYearView();
        } else {
            this.renderMonthView();
        }
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.element.innerHTML = `
            <div class="calendar-header">
                <button class="btn" onclick="calendar.prevMonth()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h2>${translations[this.language].months[month]} ${year}</h2>
                <button class="btn" onclick="calendar.nextMonth()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-grid">
                ${this.getWeekdaysHTML()}
                ${this.getDaysHTML(year, month)}
            </div>
        `;
    }

    renderYearView() {
        const year = this.currentDate.getFullYear();
        
        this.element.innerHTML = `
            <div class="calendar-header">
                <button class="btn" onclick="calendar.prevYear()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h2>${year}</h2>
                <button class="btn" onclick="calendar.nextYear()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-grid year-view">
                ${this.getMonthsHTML(year)}
            </div>
        `;
    }

    getWeekdaysHTML() {
        return translations[this.language].weekdays
            .map(day => `<div class="weekday">${day}</div>`)
            .join('');
    }

    getDaysHTML(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();
        
        let days = [];
        
        // Previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            days.push(`<div class="day other-month">${prevMonthDays - i}</div>`);
        }
        
        // Current month days
        const today = new Date();
        for (let i = 1; i <= totalDays; i++) {
            const isToday = today.getDate() === i && 
                           today.getMonth() === month && 
                           today.getFullYear() === year;
            days.push(`
                <div class="day ${isToday ? 'today' : ''}">${i}</div>
            `);
        }
        
        // Next month days
        const remainingDays = 42 - days.length; // 6 rows × 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push(`<div class="day other-month">${i}</div>`);
        }
        
        return days.join('');
    }

    getMonthsHTML(year) {
        return translations[this.language].months
            .map((month, index) => {
                const firstDay = new Date(year, index, 1);
                const lastDay = new Date(year, index + 1, 0);
                const totalDays = lastDay.getDate();
                
                return `
                    <div class="month-container">
                        <div class="month-title">${month}</div>
                        <div class="calendar-grid">
                            ${this.getWeekdaysHTML()}
                            ${this.getDaysHTML(year, index)}
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    prevYear() {
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.render();
    }

    nextYear() {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        this.render();
    }

    toggleView() {
        this.isYearView = !this.isYearView;
        this.render();
    }

    setLanguage(lang) {
        this.language = lang;
        this.render();
    }
}
