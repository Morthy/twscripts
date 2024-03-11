ResourcesForecaster.fetchSchedules(game_data.village.id, (result) => {
    let values = {};

    ['wood', 'stone', 'iron'].forEach((res) => {
        for (const [k, v] of Object.entries(result['amounts']['schedules'][res])) {
            if (!values.hasOwnProperty(k)) {
                values[k] = {};
            }

            values[k][res] = v;
        }
    });

    const ordered = Object.keys(values).sort().filter((v) => v > Timing.getCurrentServerTime()/1000 && v < (Timing.getCurrentServerTime()/1000) + 86400);
    const $widget = getFutureResourcesWidget();
    const $tbody = $widget.find('tbody');
    let lastValues = {};

    ordered.forEach((v) => {
        const resources = values[v];
        const formatted = ['wood', 'stone', 'iron'].map((res) => {
            const amount = resources.hasOwnProperty(res) ? resources[res] : (lastValues.hasOwnProperty(res) ? lastValues[res] : 0);
            lastValues[res] = amount;

            return `<img src="${Format.image_src('resources/' + res + '_18x16.png')}" /> ${amount?Format.number(Math.floor(amount)):'unknown'} `;
        });
        $tbody.append(`<tr><td>${Format.date(parseInt(v), true)}</td><td><div style="display: flex; justify-content: space-between"><span>${formatted.join('</span><span>')}</span></div></td></tr>`)
    });
});

function getFutureResourcesWidget() {
    let $widget = $('#show_future_res');

    if ($widget.length) {
        $widget.remove();
    }

    $("#rightcolumn").append(`
        <div id="show_future_res" class="vis moveable widget">
            <h4 class="head with-button ui-sortable-handle">
                <img class="widget-button" onclick="return VillageOverview.toggleWidget( 'show_future_res', this );"
                    src="graphic/minus.png"> Future resources
            </h4>
            <div class="widget_content" style="display: block;">
                <table class="vis w100">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Resources</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
        </div>`)

    $widget = $('#show_future_res');

    return $widget;
}
