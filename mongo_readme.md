#Mongo Cheat Sheet

1)  Reset a field: 
	db.answers.update({survey_id: 20}, {$set: { wins: 0 }}, {multi: true});

2) Delete all of an item
	db.responses.remove({});

