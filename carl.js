const { openBrowser, goto, write, press, click, closeBrowser } = require('taiko');
const { repl } = require('taiko/recorder');

function banner(msg) {
	console.log('**************************************************************************************************************');
	console.log('* ' + msg);
	console.log('**************************************************************************************************************');
}

(async () => {
    try {
        await openBrowser();
        await goto('http://192.168.56.21:8080/ords/f?p=EORSEC010:SEC010_LANDING:::::P101_SESSION_EXPIRED:N');
        await write('oasys_admin', into ('Username'));
        await write('password', into ('Password'));
        await click(button('Login'));
		  await dropDown({id:'P10_CT_AREA_EST'}).select('Essex');
        await click(button('Set Provider/Establishment'));
        await click(link('History'));
        await click('Offender - Pepsi Max');
        await click('Create Assessment');
		  if (await button('Yes - Guillotine WIP Immediately').exists()) {
				console.log('***ALREADY WIP ASSESSMENT***');
				await repl();
		  } else {
			  await click('OK');
			  await click('12345');
			  await click('Update Offender');
			  await click('Create');
			  await click('Section 1');
			  await click('Predictors');
			  let itm140 = await textBox({id:'itm_1_40'}).value();
			  if (itm140 == 2) {
			    console.log('**Element Q1.40 VALUE OK');
			  } else {
			    banner('Element Q1.40 -=ERROR=- VALUE = ' + itm140);
			    await click(link('Admin'));
				 await click(link('Delete Assessment'));
				 await write('CL', into ('Reason For Deletion'));
				 await click(button('OK'));
			  }
			  await click(button('close'));
		  }
		  await click(button('Logout'));
    } catch (error) {
        console.error(error);
    } finally {
        await closeBrowser();
    }
})();
