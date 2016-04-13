#Mongo Cheat Sheet

1)  Reset a field: 
	db.answers.update({survey_id: 230}, {$set: { wins: 0 }}, {multi: true});
	db.answers.update({survey_id: 230}, {$set: { losses: 0 }}, {multi: true});
	db.answers.update({survey_id: 230}, {$set: { ties: 0 }}, {multi: true});

2) Delete all of an item
	db.responses.remove({});

