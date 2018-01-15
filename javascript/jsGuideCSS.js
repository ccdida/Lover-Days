// 通过id选取元素
// window.onload=function(){
// 	var section1=document.getElementById("section1");
// alert(section1.innerText);
// }

//通过id查找多个元素
// 错误太多，无从说起，以后再看。
// window.onload=function(){

// 	function getElements() {
// 	var elements={};//开始是一个空map映射对象
// 	for(var i=0;i<arguments.length;i++){
// 		console.log(arguments[i]);
// 		var id=arguments[i];//这里的id已经是表示h1#section1.
// 		if (id==null){
		
// 			throw new Error("no element with id" + id);
// 		}
// 		elements[id]=id;//这里应该是i还是id？？
// 	}
// 	return elements;
// }
//   getElements(section1,section2);
// }

// 通过名字选取元素
// document.getElementsByName("name");定义在HTMLDocument中，即只针对HTML文档可用。