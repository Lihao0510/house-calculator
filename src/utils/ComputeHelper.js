import numeral from 'numeral';
import Config from '../config';

//通过指导价(万)计算真实指导价(元)
export function computeIndicativePrice(indicativePrice) {
	return numeral(indicativePrice)
		.multiply(10000)
		.value();
}

//通过指导价计算首付款
export function computeDownPayment(indicativePrice) {
	return numeral(indicativePrice)
		.multiply(10000)
		.multiply(0.15)
		.value();
}

//计算打折力度
export function computeDiscountPercent(discountPercent) {
	return (
		1 -
		numeral(discountPercent)
			.multiply(0.01)
			.value()
	);
}

//计算第三者责任险
export function computeThirdInsurance(thirdInsuranceType) {
	//第三者责任险类型(1: 5/2: 10/3: 20/4: 50/5: 100)
	/*
		赔5万，保费516
		赔10万，保费746
		赔20万，保费924
		赔50万，保费1252
		赔100万，保费1630
	* */
	switch (thirdInsuranceType) {
		case 1:
			return 516;
		case 2:
			return 746;
		case 3:
			return 924;
		case 4:
			return 1252;
		case 5:
			return 1630;
		default:
			return 0;
	}
}

//计算车辆损失险
export function computeDamageInsurance(model, sellPrice) {
	//6座以下基本保费=459；6坐及以上基本保费=550
	//基础保费+指导价格×1.0880%
	if (getSeat(model) < 6) {
		return (
			numeral(459).value() +
			numeral(sellPrice)
				.multiply(0.01088)
				.value()
		);
	} else {
		return (
			numeral(550).value() +
			numeral(sellPrice)
				.multiply(0.01088)
				.value()
		);
	}
}

//计算全车盗抢险
export function computeRobberyInsurance(model, sellPrice) {
	//基础保费+指导价格×费率
	//6座以下基本保费=459 费率0.00374；6坐及以上基本保费=550 费率0.004505
	if (getSeat(model) < 6) {
		return (
			102 +
			numeral(sellPrice)
				.multiply(0.00374)
				.value()
		);
	} else {
		return (
			119 +
			numeral(sellPrice)
				.multiply(0.004505)
				.value()
		);
	}
}

//计算玻璃单独破碎险
export function computeGlassInsurance(glassInsuranceType, sellPrice) {
	//进口新车购置价×0.25%，国产新车购置价×0.15%  sellPrice：指导价
	switch (glassInsuranceType) {
		case 1: //国产
			return numeral(sellPrice)
				.multiply(0.0015)
				.value();
		case 2: //进口
			return numeral(sellPrice)
				.multiply(0.0025)
				.value();
	}
}

//计算自燃损失险
export function computeBurnInsurance(sellPrice) {
	//新车购置价×0.15% sellPrice: 指导价
	return numeral(sellPrice)
		.multiply(0.0015)
		.value();
}

//计算不计免赔特约险
export function computeSpecialInsurance(damageInsuranceFee, thirdInsuranceFee) {
	//(车辆损失险+第三者责任险)×20%
	return numeral(damageInsuranceFee + thirdInsuranceFee)
		.multiply(0.2)
		.value();
}

//计算无过责任险
export function computeInnocentInsurance(thirdInsuranceFee) {
	//第三者责任险保险费×20%
	return numeral(thirdInsuranceFee)
		.multiply(0.2)
		.value();
}

//计算车上人员责任险
export function computePassengerInsurance(model) {
	//每人保费50元，可根据车辆的实际座位数填写
	return getSeat(model) * 50;
}

//计算车身划痕险
export function computeCutInsurance(cutInsuranceType) {
	/*
		"赔2千，保费400
		赔5千，保费570
		赔1万，保费760
		赔2万，保费1140"
	* */
	switch (cutInsuranceType) {
		case 1:
			return 400;
		case 2:
			return 570;
		case 3:
			return 760;
		case 4:
			return 1140;
		default:
			return 0;
	}
}

//计算涉水险
export function computeWaterInsurance(sellPrice) {
	//指导价 × 0.075%
	return numeral(sellPrice)
		.multiply(0.00075)
		.value();
}

//计算购置税
export function computePurchaseTax(sellPrice) {
	//(车价 / 1.13) * 10%
	return numeral(sellPrice)
		.divide(1.13)
		.multiply(0.1)
		.value();
}

//计算车船税
export function computeVehicleTax(model) {
	const displacement = parseFloat(model.displacement);
	//车价 × 0.075%
	if (displacement <= 1) {
		return 300;
	} else if (displacement > 1 && displacement <= 1.6) {
		return 420;
	} else if (displacement > 1.6 && displacement <= 2) {
		return 480;
	} else if (displacement > 2 && displacement <= 2.5) {
		return 900;
	} else if (displacement > 2.5 && displacement <= 3) {
		return 1920;
	} else if (displacement > 3 && displacement <= 4) {
		return 3480;
	} else {
		return 5280;
	}
}

//计算交强险
export function computeForceTax(model) {
	//车价 × 0.075%
	if (getSeat(model) < 6) {
		return 950;
	} else {
		return 1100;
	}
}

//计算上牌费
export function computeLicenceTax(licenceTax) {
	//已填写按填写的为准,未填写则为500
	return licenceTax || 500;
}

//计算贷款金额
export function computeLoanMoney(sellPress) {
	//贷款金额为落地价 + 2000
	return sellPress + 2000;
}

//计算月供
export function computeMonthInterest(loanMoney, loanYear) {
	//0.0054月利率
	return numeral(loanMoney)
		.multiply(1 + loanYear * 12 * 0.0054)
		.divide(loanYear * 12);
}

//根据车型获取座位数,如无有效数据,默认5座
function getSeat(model) {
	const { seats } = model;
	try {
		return parseInt(seats);
	} catch (e) {
		return 5;
	}
}
