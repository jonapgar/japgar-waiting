let dot = '.'
let lots = []
let max = 32

while(lots.length < max) 
	lots.push(dot)
lots =lots.join('')

const log = s=>{
	let i = 1
	return (message,alwaysShow,method)=>{
		if (!alwaysShow && message && i==1)
			return
		let dots = lots.substring(0,i+3)
		method(s,`${dots}\t${message ? `${message} in `:'at '}${i++}`)
	}
}
const map = {}
let i=0
const remind =(func,t,method)=>{
	if (typeof func == 'string') {
		func = log(func)
	}
	if (!(typeof func =='function')) {
		throw new Error('must wait on string or function')
	}
	let key = i++
	
	let value ={
		key,
		func,
		interval:setLooseInterval(()=>{
			func(false,true,method)
		},t*1000,30),
		finished:(message,alwaysShow,method)=>{
			return finished(key,message,alwaysShow,method)
		}
	}
	map[key] = value
	return value
}
const finished = (key,message,alwaysShow,method)=>{
	let value = map[key]
	if (!value) {
		throw new Error('You can\'t finish what you haven\'t started')
	}
	delete map[key]
	clearInterval(value.interval)
	value.func(message,alwaysShow,method)
}

const waiting = async (promise,func,method='log',t=1)=>{
	if (!zzz.enabled(method))
		return promise
	let resp
	let {finished} = remind(func,t,zzz[method])
	try {
		resp = await promise
	} catch (e) {
		finished('FAILED!',true,zzz[method])
		throw e
	}
	finished('DONE',false,zzz[method])
	return resp
}


module.exports = {waiting}